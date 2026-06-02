import { NextResponse } from 'next/server';
import { getUserFromCookies } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const user = await getUserFromCookies();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const domains = await prisma.domain.findMany({
      where: {
        members: {
          some: {
            userId: user.id,
            status: 'ACCEPTED'
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true }
            }
          }
        },
        _count: {
          select: { tasks: true }
        }
      }
    });

    return NextResponse.json({ domains });
  } catch (error) {
    console.error('GET domains error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getUserFromCookies();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name, description, template } = await request.json();
    if (!name || !template) return NextResponse.json({ error: 'Name and template are required' }, { status: 400 });

    const newDomain = await prisma.domain.create({
      data: {
        name,
        description,
        template,
        members: {
          create: {
            userId: user.id,
            role: 'ADMIN'
          }
        }
      }
    });

    return NextResponse.json({ domain: newDomain }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

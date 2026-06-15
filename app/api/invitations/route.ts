import { NextResponse } from 'next/server';
import { getUserFromCookies } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const user = await getUserFromCookies();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const invitations = await prisma.domainMember.findMany({
      where: {
        userId: user.id,
        OR: [
          { status: 'PENDING' },
          { pendingRole: { not: null } }
        ]
      },
      include: {
        domain: {
          include: {
            members: {
              where: { role: 'ADMIN' },
              include: { user: { select: { name: true } } }
            }
          }
        }
      }
    });

    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ invitations, notifications });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

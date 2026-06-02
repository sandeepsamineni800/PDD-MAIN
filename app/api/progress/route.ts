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
            pendingRole: null // User has accepted and is active
          }
        }
      },
      include: {
        members: {
          where: {
            userId: user.id
          },
          select: {
            role: true
          }
        },
        tasks: {
          select: {
            status: true
          }
        }
      }
    });

    // Calculate progress for each domain
    const progressData = domains.map(domain => {
      const totalTasks = domain.tasks.length;
      const completedTasks = domain.tasks.filter(t => t.status === 'DONE').length;
      const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        id: domain.id,
        name: domain.name,
        role: domain.members[0]?.role,
        totalTasks,
        completedTasks,
        progressPercentage
      };
    });

    return NextResponse.json({ domains: progressData });
  } catch (error) {
    console.error('GET progress error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

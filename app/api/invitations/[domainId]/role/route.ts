import { NextResponse } from 'next/server';
import { getUserFromCookies } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: Promise<{ domainId: string }> }) {
  try {
    const user = await getUserFromCookies();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { domainId } = await params;

    const membership = await prisma.domainMember.findUnique({
      where: { userId_domainId: { userId: user.id, domainId } }
    });

    if (!membership || !membership.pendingRole) {
      return NextResponse.json({ error: 'No pending role upgrade found' }, { status: 404 });
    }

    if (membership.pendingRole === 'SUB_ADMIN') {
      // Demote existing sub-admin (only 1 allowed according to earlier rules)
      await prisma.domainMember.updateMany({
        where: { 
          domainId: domainId,
          role: 'SUB_ADMIN'
        },
        data: { role: 'MEMBER' }
      });
    }

    // Accept role upgrade
    const updatedMember = await prisma.domainMember.update({
      where: { userId_domainId: { userId: user.id, domainId } },
      data: { role: membership.pendingRole, pendingRole: null }
    });

    return NextResponse.json({ member: updatedMember }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ domainId: string }> }) {
  try {
    const user = await getUserFromCookies();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { domainId } = await params;

    const membership = await prisma.domainMember.findUnique({
      where: { userId_domainId: { userId: user.id, domainId } }
    });

    if (!membership || !membership.pendingRole) {
      return NextResponse.json({ error: 'No pending role upgrade found' }, { status: 404 });
    }

    // Reject role upgrade (keep existing role, clear pendingRole)
    const updatedMember = await prisma.domainMember.update({
      where: { userId_domainId: { userId: user.id, domainId } },
      data: { pendingRole: null }
    });

    return NextResponse.json({ member: updatedMember }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

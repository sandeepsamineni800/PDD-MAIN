import { NextResponse } from 'next/server';
import { getUserFromCookies } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: Promise<{ domainId: string }> }) {
  try {
    const user = await getUserFromCookies();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { domainId } = await params;

    // Verify invitation exists
    const invitation = await prisma.domainMember.findUnique({
      where: { userId_domainId: { userId: user.id, domainId } }
    });

    if (!invitation || invitation.status !== 'PENDING') {
      return NextResponse.json({ error: 'Invitation not found or already processed' }, { status: 404 });
    }

    // Accept invitation
    const updatedMember = await prisma.domainMember.update({
      where: { userId_domainId: { userId: user.id, domainId } },
      data: { status: 'ACCEPTED' }
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

    // Verify invitation exists
    const invitation = await prisma.domainMember.findUnique({
      where: { userId_domainId: { userId: user.id, domainId } }
    });

    if (!invitation || invitation.status !== 'PENDING') {
      return NextResponse.json({ error: 'Invitation not found or already processed' }, { status: 404 });
    }

    // Reject invitation (Delete record)
    await prisma.domainMember.delete({
      where: { userId_domainId: { userId: user.id, domainId } }
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

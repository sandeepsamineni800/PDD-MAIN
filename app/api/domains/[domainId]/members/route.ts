import { NextResponse } from 'next/server';
import { getUserFromCookies } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ domainId: string }> }) {
  try {
    const user = await getUserFromCookies();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { domainId } = await params;

    // Verify requesting user is part of the domain
    const isMember = await prisma.domainMember.findUnique({
      where: { userId_domainId: { userId: user.id, domainId } }
    });

    if (!isMember) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const members = await prisma.domainMember.findMany({
      where: { domainId },
      include: {
        user: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json({ members });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ domainId: string }> }) {
  try {
    const user = await getUserFromCookies();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { domainId } = await params;
    const { email } = await request.json();

    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    // Verify requesting user is an admin or sub-admin
    const requesterMembership = await prisma.domainMember.findUnique({
      where: { userId_domainId: { userId: user.id, domainId } }
    });

    if (!requesterMembership || (requesterMembership.role !== 'ADMIN' && requesterMembership.role !== 'SUB_ADMIN')) {
      return NextResponse.json({ error: 'Only Admins and Sub-Admins can add members' }, { status: 403 });
    }

    // Find the user to add by email
    const userToAdd = await prisma.user.findUnique({
      where: { email }
    });

    if (!userToAdd) {
      return NextResponse.json({ error: 'User not found. They must register first.' }, { status: 404 });
    }

    // Check if they are already in the domain
    const existingMember = await prisma.domainMember.findUnique({
      where: { userId_domainId: { userId: userToAdd.id, domainId } }
    });

    if (existingMember) {
      return NextResponse.json({ error: 'User is already a member of this domain' }, { status: 400 });
    }

    // Add them to the domain with PENDING status
    const newMember = await prisma.domainMember.create({
      data: {
        userId: userToAdd.id,
        domainId,
        role: 'MEMBER',
        status: 'PENDING'
      },
      include: {
        user: { select: { id: true, name: true, email: true } }
      }
    });

    return NextResponse.json({ member: newMember }, { status: 201 });
  } catch (error) {
    console.error('Add member error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

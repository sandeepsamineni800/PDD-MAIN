import { NextResponse } from 'next/server';
import { getUserFromCookies } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(request: Request, { params }: { params: Promise<{ domainId: string }> }) {
  try {
    const user = await getUserFromCookies();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { domainId } = await params;
    const { name, description } = await request.json();

    // Verify user is an admin of the domain
    const membership = await prisma.domainMember.findUnique({
      where: { userId_domainId: { userId: user.id, domainId } }
    });

    if (!membership || membership.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only admins can edit this domain' }, { status: 403 });
    }

    const updatedDomain = await prisma.domain.update({
      where: { id: domainId },
      data: { name, description }
    });

    return NextResponse.json({ domain: updatedDomain });
  } catch (error) {
    console.error('Update domain error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ domainId: string }> }) {
  try {
    const user = await getUserFromCookies();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let password = '';
    try {
      const body = await request.json();
      password = body.password || '';
    } catch (e) {
      return NextResponse.json({ error: 'Password is required to delete this domain' }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ error: 'Password is required to delete this domain' }, { status: 400 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true, password: true }
    });

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isValidPassword = await bcrypt.compare(password, dbUser.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid password. Domain deletion aborted.' }, { status: 401 });
    }

    const { domainId } = await params;

    // Verify user is an admin of the domain
    const membership = await prisma.domainMember.findUnique({
      where: { userId_domainId: { userId: user.id, domainId } }
    });

    if (!membership || membership.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Only admins can delete this domain' }, { status: 403 });
    }

    // Prisma schema uses onDelete: Cascade for DomainMember and Task,
    // so deleting the domain will automatically clean up related records.
    await prisma.domain.delete({
      where: { id: domainId }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete domain error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, otp, newPassword } = await request.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Find the OTP
    const validOtp = await prisma.oTP.findFirst({
      where: {
        email: cleanEmail,
        code: otp,
        expiresAt: {
          gt: new Date() // Must not be expired
        }
      }
    });

    if (!validOtp) {
      return NextResponse.json({ error: 'Invalid or expired OTP code' }, { status: 400 });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password
    await prisma.user.update({
      where: { email: cleanEmail },
      data: { password: hashedPassword }
    });

    // Delete the used OTP
    await prisma.oTP.delete({
      where: { id: validOtp.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

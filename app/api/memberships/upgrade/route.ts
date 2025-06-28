import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  const cookieStore = cookies();
  const token = cookieStore.get('session_token');

  if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { newTier } = await request.json();
  if (!newTier) {
    return NextResponse.json({ message: 'New tier not specified' }, { status: 400 });
  }

  try {
    const decoded = jwt.verify(token.value, 'BU-COK-GIZLI-BIR-ANAHTAR-OLMALI-NORMALDE');
    if (typeof decoded === 'string' || !decoded.userId) {
      throw new Error('Invalid token');
    }

    // Kullanıcının üyelik seviyesini veritabanında güncelliyoruz
    const updatedUser = await prisma.user.update({
      where: { id: decoded.userId },
      data: { membershipTier: newTier },
    });

    console.log(`User ${updatedUser.username} upgraded to ${newTier}`);

    return NextResponse.json({ success: true, message: `Successfully upgraded to ${newTier}!` });

  } catch (error) {
    return NextResponse.json({ message: 'Authentication failed or user not found' }, { status: 401 });
  }
}
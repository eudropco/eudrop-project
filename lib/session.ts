import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('session_token');

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token.value, 'BU-COK-GIZLI-BIR-ANAHTAR-OLMALI-NORMALDE');
    if (typeof decoded === 'string' || !decoded.userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    return user;

  } catch (error) {
    return null;
  }
}
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { User } from '@prisma/client';

export async function getCurrentUser(): Promise<User | null> {
  const tokenCookie = cookies().get('session_token');
  const secret = process.env.JWT_SECRET;

  if (!tokenCookie || !secret) {
    return null;
  }

  try {
    const decoded = jwt.verify(tokenCookie.value, secret);
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
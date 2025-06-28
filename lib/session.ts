import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { User } from '@prisma/client';
import prisma from '@/lib/prisma';

interface SessionData {
  userId?: string;
}

const sessionOptions = {
  password: process.env.JWT_SECRET!,
  cookieName: 'session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function getCurrentUser(): Promise<User | null> {
  try {
    // await eksikti
    const cookieStore = await cookies();

    const session = await getIronSession<SessionData>(cookieStore, sessionOptions);

    if (!session.userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    return user;
  } catch (error) {
    return null;
  }
}

import { getIronSession } from 'iron-session';
// DEĞİŞİKLİK 1: 'type CookieStore' eklendi.
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
    const cookieStore = cookies();
    
    // DEĞİŞİKLİK 2: 'as CookieStore' eklenerek tip zorlaması yapıldı.
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

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
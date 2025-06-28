import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { User } from '@prisma/client';
import prisma from '@/lib/prisma';

// Session verisinin içinde ne olacağını tanımlıyoruz.
interface SessionData {
  userId?: string;
}

// Session ayarlarını tek bir yerde topluyoruz.
const sessionOptions = {
  password: process.env.JWT_SECRET!,
  cookieName: 'session', // Login API'ında verdiğimiz isimle aynı olmalı
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function getCurrentUser(): Promise<User | null> {
  try {
    // getIronSession fonksiyonu hem çerezi okur hem de şifresini çözer.
    const session = await getIronSession<SessionData>(cookies(), sessionOptions);

    if (!session.userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
    });

    return user;

  } catch (error) {
    // Herhangi bir hata durumunda (geçersiz çerez vb.) null döner.
    return null;
  }
}
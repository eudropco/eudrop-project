import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import prisma from '@/lib/prisma';

export async function getCurrentUser(): Promise<User | null> {
  // 1. next/headers'tan cookie'yi güvenle oku
  const tokenCookie = cookies().get('session_token');
  const secret = process.env.JWT_SECRET;

  if (!tokenCookie || !secret) {
    return null;
  }

  try {
    // 2. JWT kütüphanesi ile token'ı doğrula ve çöz
    const decoded = jwt.verify(tokenCookie.value, secret);

    if (typeof decoded === 'string' || !decoded.userId) {
      return null;
    }

    // 3. Token'dan gelen userId ile veritabanından kullanıcıyı bul
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    return user;

  } catch (error) {
    // Geçersiz token durumunda hata yakala
    return null;
  }
}
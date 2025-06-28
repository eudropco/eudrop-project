import { cookies } from 'next/headers';
import { unsealData } from 'iron-session'; // Daha güvenli bir oturum yönetimi için farklı bir yaklaşım kullanacağız
import { User } from '@prisma/client';
import prisma from '@/lib/prisma';

// Bu, iron-session'ın gerektirdiği gizli şifre. .env'deki ile aynı olabilir.
const sessionPassword = process.env.JWT_SECRET!;

// Bu, eski jwt kodumuzun yerine geçecek olan, daha modern ve Next.js ile uyumlu yeni fonksiyonumuz.
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('session');

  if (!sessionCookie) {
    return null;
  }

  try {
    // Çerezi, verdiğimiz gizli şifre ile çözümlüyoruz.
    const { userId } = await unsealData<{ userId: string }>(sessionCookie.value, {
      password: sessionPassword,
      ttl: 60 * 60 * 24, // 1 gün (login API'ındaki maxAge ile aynı olmalı)
    });

    if (!userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    return user;

  } catch (error) {
    // Eğer çerez çözülemezse (geçersiz, süresi dolmuş vb.), null döner.
    return null;
  }
}
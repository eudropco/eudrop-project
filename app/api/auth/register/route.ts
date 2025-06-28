export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Oluşturduğumuz paylaşılan bağlantıyı çağırıyoruz
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json();

    if (!email || !username || !password) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    // Şifreyi hash'liyoruz
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Prisma kullanarak yeni kullanıcıyı veritabanına oluşturuyoruz
    const user = await prisma.user.create({
      data: {
        email: email,
        username: username,
        hashedPassword: hashedPassword,
        registrationIp: request.headers.get('x-forwarded-for') ?? '127.0.0.1',
      },
    });

    return NextResponse.json({ message: 'Account created successfully!', userId: user.id }, { status: 201 });

  } catch (error: any) {
    // Eğer e-posta veya kullanıcı adı zaten varsa, Prisma bir hata fırlatacaktır.
    if (error.code === 'P2002') {
      return NextResponse.json({ message: 'User with this email or username already exists.' }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
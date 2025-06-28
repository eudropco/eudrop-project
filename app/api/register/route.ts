import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs'; // Vercel için runtime'ı belirtiyoruz

export async function POST(request: Request) {
  try {
    const { email, username, password } = await request.json();

    if (!email || !username || !password) {
      return NextResponse.json({ message: 'Missing fields' }, { status: 400 });
    }

    // E-posta veya kullanıcı adının daha önce alınıp alınmadığını kontrol et
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json({ message: 'User with this email or username already exists.' }, { status: 409 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
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
    console.error(error);
    return NextResponse.json({ message: 'An internal server error occurred.' }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const { newTier } = await request.json();
  if (!newTier) {
    return NextResponse.json({ message: 'New tier not specified' }, { status: 400 });
  }

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { membershipTier: newTier },
    });

    console.log(`SUCCESS: User ${session.user.username} upgraded to ${newTier}.`);
    return NextResponse.json({ success: true, message: `Successfully upgraded to ${newTier}!` });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
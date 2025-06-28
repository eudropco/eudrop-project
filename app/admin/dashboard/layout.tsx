import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth'; // Ayarları merkezi dosyamızdan çekiyoruz


export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.membershipTier !== 'Admin') {
    redirect('/');
  }

  return <section>{children}</section>;
}
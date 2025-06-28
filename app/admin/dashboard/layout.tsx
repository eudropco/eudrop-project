import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';

// Bu layout, içindeki tüm sayfaları koruma altına alır.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser();

  // Eğer giriş yapmış bir kullanıcı yoksa veya kullanıcının seviyesi 'Admin' değilse,
  // onu ana sayfaya geri atıyoruz.
  if (!user || user.membershipTier !== 'Admin') {
    redirect('/');
  }

  // Eğer kullanıcı Admin ise, sayfanın içeriğini gösteriyoruz.
  return (
    <section>
      {/* Gelecekte buraya admin paneline özel bir menü vb. eklenebilir. */}
      {children}
    </section>
  );
}
import ProductCard from '../components/ProductCard';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/session'; // Aynı merkezi fonksiyonu burada da kullanıyoruz
import { redirect } from 'next/navigation';

type TierName = 'Fixer' | 'Street Samurai' | 'Netrunner' | 'Free';
const tierBenefits: Record<TierName, { discountRate: number }> = {
  'Fixer': { discountRate: 0.30 },
  'Street Samurai': { discountRate: 0.15 },
  'Netrunner': { discountRate: 0.05 },
  'Free': { discountRate: 0 }
};

const products = [
  { id: 'netflix-premium', name: 'Netflix Premium', price: 12.99, imageUrl: 'https://i.imgur.com/ww3zP1w.png' },
  { id: 'spotify-premium', name: 'Spotify Premium', price: 9.99, imageUrl: 'https://i.imgur.com/J1ca42Y.png' },
  // ... Diğer ürünler aynı ...
  { id: 'youtube-premium', name: 'YouTube Premium', price: 11.99, imageUrl: 'https://i.imgur.com/Sj5eD2z.png' },
  { id: 'xbox-game-pass', name: 'Xbox Game Pass', price: 14.99, imageUrl: 'https://i.imgur.com/K3a2i4B.png' },
  { id: 'discord-nitro', name: 'Discord Nitro', price: 9.99, imageUrl: 'https://i.imgur.com/C5m3s1B.png' },
  { id: 'disney-plus', name: 'Disney+', price: 7.99, imageUrl: 'https://i.imgur.com/4a0gJb2.png' },
];

export default async function StorePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/'); // Giriş yapmamışsa anasayfaya at
  }

  const userDiscountRate = tierBenefits[user.membershipTier as TierName]?.discountRate || 0;

  return (
    <main className="min-h-screen w-full bg-[#0A0E1A] text-white font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-wider">Store</h1>
            <p className="text-green-400 font-semibold">Active Discount: {(userDiscountRate * 100).toFixed(0)}% ({user.membershipTier} Tier)</p>
          </div>
          <Link href="/dashboard"><button className="px-4 py-2 bg-pink-600 hover:bg-pink-700 rounded-md font-bold transition">&larr; Back to Dashboard</button></Link>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const discountedPrice = product.price * (1 - userDiscountRate);
            return (
              <ProductCard
                key={product.id}
                name={product.name}
                originalPrice={product.price}
                discountedPrice={discountedPrice}
                imageUrl={product.imageUrl}
                slug={product.id}
              />
            );
          })}
        </div>
      </div>
    </main>
  );
}
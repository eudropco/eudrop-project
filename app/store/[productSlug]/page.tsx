'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

// Ürünlerimizin tipini tanımlıyoruz
type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

// Sayfanın alacağı props'ların tipini burada açıkça belirtiyoruz. Hata buydu.
type Props = {
  params: { productSlug: string };
};

// Ürün listesini bileşenin dışında tutmak daha iyi bir pratiktir
const products: Product[] = [
  { id: 'netflix-premium', name: 'Netflix Premium', price: 12.99, imageUrl: 'https://i.imgur.com/ww3zP1w.png' },
  { id: 'spotify-premium', name: 'Spotify Premium', price: 9.99, imageUrl: 'https://i.imgur.com/J1ca42Y.png' },
  { id: 'youtube-premium', name: 'YouTube Premium', price: 11.99, imageUrl: 'https://i.imgur.com/Sj5eD2z.png' },
  { id: 'xbox-game-pass', name: 'Xbox Game Pass', price: 14.99, imageUrl: 'https://i.imgur.com/K3a2i4B.png' },
  { id: 'discord-nitro', name: 'Discord Nitro', price: 9.99, imageUrl: 'https://i.imgur.com/C5m3s1B.png' },
  { id: 'disney-plus', name: 'Disney+', price: 7.99, imageUrl: 'https://i.imgur.com/4a0gJb2.png' },
];

export default function ProductDetailPage({ params }: Props) {
  const [orderType, setOrderType] = useState('new');
  const [existingUsername, setExistingUsername] = useState('');
  const [existingPassword, setExistingPassword] = useState('');
  const [message, setMessage] = useState('');
  const [product, setProduct] = useState<Product | undefined>(undefined);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === params.productSlug);
    setProduct(foundProduct);
  }, [params.productSlug]);

  if (!product) {
    return <div className="text-white text-center p-10 min-h-screen flex items-center justify-center">Loading product...</div>;
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Submitting your order...');

    const orderData = {
      productName: product.name,
      price: product.price,
      orderType: orderType,
      existingUsername: orderType === 'upgrade' ? existingUsername : undefined,
      existingPassword: orderType === 'upgrade' ? existingPassword : undefined,
    };

    const response = await fetch('/api/orders/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData),
    });

    const data = await response.json();
    setMessage(data.message);
  };

  return (
    <main className="min-h-screen w-full bg-[#0A0E1A] text-white font-sans p-4 sm:p-6 md:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-cyan-400 text-2xl mt-2">${product.price.toFixed(2)}</p>
        </header>

        <form onSubmit={handleSubmitOrder} className="bg-gray-900 bg-opacity-70 p-8 rounded-2xl border border-gray-700 space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-pink-400">Choose your option:</h2>
            <div className="flex gap-4">
              <label className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition ${orderType === 'new' ? 'border-cyan-500 bg-cyan-900/50' : 'border-gray-600'}`}>
                <input type="radio" name="orderType" value="new" checked={orderType === 'new'} onChange={(e) => setOrderType(e.target.value)} className="hidden" />
                <span className="font-bold text-lg">Create a New Account For Me</span>
                <p className="text-sm text-gray-400">We will create a brand new account and send you the details.</p>
              </label>
              <label className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition ${orderType === 'upgrade' ? 'border-cyan-500 bg-cyan-900/50' : 'border-gray-600'}`}>
                <input type="radio" name="orderType" value="upgrade" checked={orderType === 'upgrade'} onChange={(e) => setOrderType(e.target.value)} className="hidden" />
                <span className="font-bold text-lg">Upgrade My Existing Account</span>
                <p className="text-sm text-gray-400">Provide your existing account details below.</p>
              </label>
            </div>
          </div>

          {orderType === 'upgrade' && (
            <div className="space-y-4 pt-4 border-t border-gray-700">
              <input type="text" value={existingUsername} onChange={(e) => setExistingUsername(e.target.value)} placeholder="Your Existing Username/Email" required className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition"/>
              <input type="password" value={existingPassword} onChange={(e) => setExistingPassword(e.target.value)} placeholder="Your Existing Password" required className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 transition"/>
            </div>
          )}

          <button type="submit" className="w-full px-4 py-3 font-bold text-white uppercase bg-green-600 rounded-md hover:bg-green-700 transition-colors duration-300">
            Confirm Purchase
          </button>

          {message && <p className="mt-4 text-center font-bold text-green-400">{message}</p>}

          <div className="text-center pt-4">
            <Link href="/store"><span className="text-pink-500 hover:underline"> &larr; Back to Store</span></Link>
          </div>
        </form>
      </div>
    </main>
  );
}
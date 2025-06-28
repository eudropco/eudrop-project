'use client';
import { useState } from 'react';
import Link from 'next/link';

const tiers = [
  { 
    name: 'Netrunner', 
    priceId: 'price_1ReqY8IJnqxvV31e1k53UM8y', // <-- BURAYI DEĞİŞTİR: Stripe'taki Netrunner Plan'ın Fiyat ID'si
    price: '$9.99/mo', 
    benefits: ['5% Store Discount', '250,000 AI Tokens', 'Standard Support'], 
    color: 'border-cyan-500', 
    buttonColor: 'bg-cyan-600 hover:bg-cyan-700' 
  },
  { 
    name: 'Street Samurai', 
    priceId: 'price_1ReqYxIJnqxvV31e3Bk2AB9f', // <-- BURAYI DEĞİŞTİR: Stripe'taki Street Samurai Plan'ın Fiyat ID'si
    price: '$24.99/mo', 
    benefits: ['15% Store Discount', '1,000,000 AI Tokens', 'Discord Role'], 
    color: 'border-purple-500', 
    buttonColor: 'bg-purple-600 hover:bg-purple-700' 
  },
  { 
    name: 'Fixer', 
    priceId: 'price_1ReqZXIJnqxvV31e64lbsTDO', // <-- BURAYI DEĞİŞTİR: Stripe'taki Fixer Plan'ın Fiyat ID'si
    price: '$59.99/mo', 
    benefits: ['30% Store Discount', '3,000,000 AI Tokens', 'Priority Support'], 
    color: 'border-orange-500', 
    buttonColor: 'bg-orange-600 hover:bg-orange-700' 
  }
];

export default function MembershipsPage() {
  const [loading, setLoading] = useState(''); // Hangi butonun yüklendiğini takip etmek için

  const handleUpgrade = async (priceId: string, tierName: string) => {
    setLoading(tierName); // Yüklenme durumunu başlat

    const response = await fetch('/api/stripe/checkout-sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId: priceId }),
    });

    const data = await response.json();

    if (data.url) {
      // Stripe'ın verdiği URL'e yönlendiriyoruz
      window.location.href = data.url;
    } else {
      // Bir hata olursa
      alert(data.error || 'An unexpected error occurred.');
      setLoading(''); // Yüklenme durumunu bitir
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#0A0E1A] text-white font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl font-bold mb-4">Choose Your Path</h1>
        <p className="text-xl text-gray-400 mb-12">Upgrade your membership to unlock new possibilities.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map(tier => (
            <div key={tier.name} className={`p-8 rounded-2xl bg-gray-900 bg-opacity-70 border-2 ${tier.color} flex flex-col`}>
              <h2 className="text-3xl font-bold">{tier.name}</h2>
              <p className="text-4xl font-extrabold my-6">{tier.price}</p>
              <ul className="space-y-3 text-left mb-8 flex-grow">
                {tier.benefits.map(benefit => <li key={benefit}>✓ {benefit}</li>)}
              </ul>
              <button 
                onClick={() => handleUpgrade(tier.priceId, tier.name)} 
                disabled={loading !== ''}
                className={`w-full px-4 py-3 font-bold text-white uppercase rounded-md transition-colors duration-300 ${tier.buttonColor} disabled:opacity-50`}
              >
                {loading === tier.name ? 'Redirecting...' : `Upgrade to ${tier.name}`}
              </button>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Link href="/dashboard"><span className="text-pink-500 hover:underline">&larr; Back to Dashboard</span></Link>
        </div>
      </div>
    </main>
  );
}
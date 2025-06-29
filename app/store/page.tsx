'use client';
import ProductCard from '../components/ProductCard';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

// NextAuth session objesindeki user tipini genişletiyoruz
type ExtendedUser = {
  membershipTier?: string | null;
};

const products = [
  { id: 'youtube-premium-1-month', name: 'YouTube Premium - 1 Month', price: 6 },
  { id: 'youtube-premium-3-months', name: 'YouTube Premium - 3 Months', price: 13 },
  { id: 'spotify-solo-premium-1-month', name: 'Spotify Solo Premium - 1 Month', price: 5 },
  { id: 'discord-nitro-12-months', name: 'Discord Nitro - 12 Months', price: 50 },
  { id: 'netflix-uhd-12-months', name: 'Netflix UHD - 12 Months', price: 75 },
  { id: 'adobe-creative-cloud-lifetime', name: 'Adobe Creative Cloud - Lifetime', price: 200 },
  { id: 'chatgpt-plus-12-months', name: 'ChatGPT Plus - 12 Months', price: 200 },
  { id: 'gemini-advanced-12-months', name: 'Gemini Advanced - 12 Months', price: 180 },
];

type TierName = 'Fixer' | 'Street Samurai' | 'Netrunner' | 'Free' | 'Admin';
const tierBenefits: Record<TierName, { discountRate: number }> = {
  'Admin': { discountRate: 1.0 }, 'Fixer': { discountRate: 0.30 },
  'Street Samurai': { discountRate: 0.15 }, 'Netrunner': { discountRate: 0.05 },
  'Free': { discountRate: 0 }
};

export default function StorePage() {
    const { data: session, status } = useSession(); // Artık bu hook, Provider sayesinde düzgün çalışacak

    if (status === "loading") {
        return <div className="text-white text-center p-10 min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (status === "unauthenticated" || !session?.user) {
        return <div className="text-white text-center p-10 min-h-screen flex items-center justify-center">Please log in to view the store.</div>;
    }

    const user = session.user as ExtendedUser;
    const userDiscountRate = tierBenefits[user.membershipTier as TierName]?.discountRate ?? 0;

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
                                slug={product.id}
                            />
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
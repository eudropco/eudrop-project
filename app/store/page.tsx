'use client';
import ProductCard from '../components/ProductCard';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react'; // Client-side session hook

// Bu yapı, NextAuth'un session objesine eklediğimiz özel alanları tanımlar
type ExtendedUser = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  membershipTier?: string | null;
  username?: string | null;
};

// Gerçek ürün listemiz
const products = [
  // Entertainment
  { id: 'youtube-premium-1-month', name: 'YouTube Premium - 1 Month', price: 6, category: 'Entertainment', imageUrl: 'https://i.imgur.com/Sj5eD2z.png' },
  { id: 'youtube-premium-3-months', name: 'YouTube Premium - 3 Months', price: 13, category: 'Entertainment', imageUrl: 'https://i.imgur.com/Sj5eD2z.png' },
  { id: 'youtube-premium-6-months', name: 'YouTube Premium - 6 Months', price: 20, category: 'Entertainment', imageUrl: 'https://i.imgur.com/Sj5eD2z.png' },
  { id: 'youtube-premium-9-months', name: 'YouTube Premium - 9 Months', price: 38, category: 'Entertainment', imageUrl: 'https://i.imgur.com/Sj5eD2z.png' },
  { id: 'youtube-premium-12-months', name: 'YouTube Premium - 12 Months', price: 42, category: 'Entertainment', imageUrl: 'https://i.imgur.com/Sj5eD2z.png' },
  { id: 'youtube-family-owner-1-month', name: 'YouTube Family Owner - 1 Month', price: 10, category: 'Entertainment', imageUrl: 'https://i.imgur.com/Sj5eD2z.png' },
  { id: 'youtube-family-owner-3-months', name: 'YouTube Family Owner - 3 Months', price: 24, category: 'Entertainment', imageUrl: 'https://i.imgur.com/Sj5eD2z.png' },
  { id: 'youtube-family-owner-6-months', name: 'YouTube Family Owner - 6 Months', price: 48, category: 'Entertainment', imageUrl: 'https://i.imgur.com/Sj5eD2z.png' },
  { id: 'youtube-family-owner-9-months', name: 'YouTube Family Owner - 9 Months', price: 70, category: 'Entertainment', imageUrl: 'https://i.imgur.com/Sj5eD2z.png' },
  { id: 'youtube-family-owner-12-months', name: 'YouTube Family Owner - 12 Months', price: 80, category: 'Entertainment', imageUrl: 'https://i.imgur.com/Sj5eD2z.png' },
  { id: 'spotify-solo-premium-1-month', name: 'Spotify Solo Premium - 1 Month', price: 5, category: 'Audio', imageUrl: 'https://i.imgur.com/J1ca42Y.png' },
  { id: 'spotify-solo-premium-3-months', name: 'Spotify Solo Premium - 3 Months', price: 10, category: 'Audio', imageUrl: 'https://i.imgur.com/J1ca42Y.png' },
  { id: 'spotify-solo-premium-6-months', name: 'Spotify Solo Premium - 6 Months', price: 20, category: 'Audio', imageUrl: 'https://i.imgur.com/J1ca42Y.png' },
  { id: 'spotify-solo-premium-9-months', name: 'Spotify Solo Premium - 9 Months', price: 28, category: 'Audio', imageUrl: 'https://i.imgur.com/J1ca42Y.png' },
  { id: 'spotify-solo-premium-12-months', name: 'Spotify Solo Premium - 12 Months', price: 35, category: 'Audio', imageUrl: 'https://i.imgur.com/J1ca42Y.png' },
  { id: 'spotify-duo-1-month', name: 'Spotify Duo - 1 Month', price: 6, category: 'Audio', imageUrl: 'https://i.imgur.com/J1ca42Y.png' },
  { id: 'spotify-duo-3-months', name: 'Spotify Duo - 3 Months', price: 12, category: 'Audio', imageUrl: 'https://i.imgur.com/J1ca42Y.png' },
  { id: 'spotify-duo-6-months', name: 'Spotify Duo - 6 Months', price: 24, category: 'Audio', imageUrl: 'https://i.imgur.com/J1ca42Y.png' },
  { id: 'spotify-duo-9-months', name: 'Spotify Duo - 9 Months', price: 38, category: 'Audio', imageUrl: 'https://i.imgur.com/J1ca42Y.png' },
  { id: 'spotify-duo-12-months', name: 'Spotify Duo - 12 Months', price: 50, category: 'Audio', imageUrl: 'https://i.imgur.com/J1ca42Y.png' },
  { id: 'spotify-family-owner-1-month', name: 'Spotify Family Owner - 1 Month', price: 6, category: 'Audio', imageUrl: 'https://i.imgur.com/J1ca42Y.png' },
  { id: 'spotify-family-owner-3-months', name: 'Spotify Family Owner - 3 Months', price: 16, category: 'Audio', imageUrl: 'https://i.imgur.com/J1ca42Y.png' },
  { id: 'spotify-family-owner-6-months', name: 'Spotify Family Owner - 6 Months', price: 32, category: 'Audio', imageUrl: 'https://i.imgur.com/J1ca42Y.png' },
  { id: 'spotify-family-owner-9-months', name: 'Spotify Family Owner - 9 Months', price: 48, category: 'Audio', imageUrl: 'https://i.imgur.com/J1ca42Y.png' },
  { id: 'spotify-family-owner-12-months', name: 'Spotify Family Owner - 12 Months', price: 64, category: 'Audio', imageUrl: 'https://i.imgur.com/J1ca42Y.png' },
  { id: 'spotify-premium-lifetime', name: 'Spotify Premium - Lifetime', price: 20, category: 'Audio', imageUrl: 'https://i.imgur.com/J1ca42Y.png' },
  { id: 'discord-nitro-12-months', name: 'Discord Nitro - 12 Months', price: 50, category: 'Gaming', imageUrl: 'https://i.imgur.com/C5m3s1B.png' },
  { id: 'amazon-prime-video-1-month', name: 'Amazon Prime Video - 1 Month', price: 5, category: 'Entertainment', imageUrl: 'https://i.imgur.com/5NTd3d5.png' },
  { id: 'amazon-prime-video-3-months', name: 'Amazon Prime Video - 3 Months', price: 10, category: 'Entertainment', imageUrl: 'https://i.imgur.com/5NTd3d5.png' },
  { id: 'amazon-prime-video-6-months', name: 'Amazon Prime Video - 6 Months', price: 15, category: 'Entertainment', imageUrl: 'https://i.imgur.com/5NTd3d5.png' },
  { id: 'amazon-prime-video-12-months', name: 'Amazon Prime Video - 12 Months', price: 30, category: 'Entertainment', imageUrl: 'https://i.imgur.com/5NTd3d5.png' },
  { id: 'crunchyroll-fan-1-month', name: 'CrunchyRoll Fan - 1 Month', price: 3, category: 'Entertainment', imageUrl: 'https://i.imgur.com/bZ3yL2P.png' },
  { id: 'crunchyroll-fan-3-months', name: 'CrunchyRoll Fan - 3 Months', price: 9, category: 'Entertainment', imageUrl: 'https://i.imgur.com/bZ3yL2P.png' },
  { id: 'crunchyroll-fan-6-months', name: 'CrunchyRoll Fan - 6 Months', price: 18, category: 'Entertainment', imageUrl: 'https://i.imgur.com/bZ3yL2P.png' },
  { id: 'crunchyroll-fan-12-months', name: 'CrunchyRoll Fan - 12 Months', price: 36, category: 'Entertainment', imageUrl: 'https://i.imgur.com/bZ3yL2P.png' },
  { id: 'crunchyroll-mega-fan-1-month', name: 'CrunchyRoll Mega Fan - 1 Month', price: 4, category: 'Entertainment', imageUrl: 'https://i.imgur.com/bZ3yL2P.png' },
  { id: 'crunchyroll-mega-fan-3-months', name: 'CrunchyRoll Mega Fan - 3 Months', price: 12, category: 'Entertainment', imageUrl: 'https://i.imgur.com/bZ3yL2P.png' },
  { id: 'crunchyroll-mega-fan-6-months', name: 'CrunchyRoll Mega Fan - 6 Months', price: 24, category: 'Entertainment', imageUrl: 'https://i.imgur.com/bZ3yL2P.png' },
  { id: 'crunchyroll-mega-fan-12-months', name: 'CrunchyRoll Mega Fan - 12 Months', price: 48, category: 'Entertainment', imageUrl: 'https://i.imgur.com/bZ3yL2P.png' },
  { id: 'crunchyroll-mega-fan-lifetime', name: 'CrunchyRoll Mega Fan - Lifetime', price: 80, category: 'Entertainment', imageUrl: 'https://i.imgur.com/bZ3yL2P.png' },
  { id: 'disney-plus-12-months', name: 'Disney+ - 12 Months', price: 65, category: 'Entertainment', imageUrl: 'https://i.imgur.com/4a0gJb2.png' },
  { id: 'netflix-uhd-12-months', name: 'Netflix UHD - 12 Months', price: 75, category: 'Entertainment', imageUrl: 'https://i.imgur.com/ww3zP1w.png' },
  { id: 'apple-music-lifetime', name: 'Apple Music - Lifetime', price: 300, category: 'Audio', imageUrl: 'https://i.imgur.com/4xQZQ9Y.png' },
  { id: 'apple-one-premier-12-months', name: 'Apple One Premier - 12 Months', price: 200, category: 'Productivity', imageUrl: 'https://i.imgur.com/v8sYf5A.png' },
  { id: 'apple-one-premier-15-months', name: 'Apple One Premier - 15 Months', price: 250, category: 'Productivity', imageUrl: 'https://i.imgur.com/v8sYf5A.png' },
  { id: 'apple-one-premier-24-months', name: 'Apple One Premier - 24 Months', price: 350, category: 'Productivity', imageUrl: 'https://i.imgur.com/v8sYf5A.png' },
  { id: 'apple-one-premier-48-months', name: 'Apple One Premier - 48 Months', price: 800, category: 'Productivity', imageUrl: 'https://i.imgur.com/v8sYf5A.png' },
  { id: 'xbox-game-pass-ultimate-15-months', name: 'Xbox Game Pass Ultimate - 15 Months', price: 130, category: 'Gaming', imageUrl: 'https://i.imgur.com/K3a2i4B.png' },
  // AI & Productivity
  { id: 'chatgpt-plus-12-months', name: 'ChatGPT Plus - 12 Months', price: 200, category: 'AI', imageUrl: 'https://i.imgur.com/JSZtG2p.png' },
  { id: 'gemini-12-months', name: 'Gemini Advanced - 12 Months', price: 180, category: 'AI', imageUrl: 'https://i.imgur.com/1GMS9S6.png' },
  { id: 'perplexity-ai-pro-12-months', name: 'Perplexity AI Pro - 12 Months', price: 50, category: 'AI', imageUrl: 'https://i.imgur.com/jM84aG9.png' },
  { id: 'coursera-plus-12-months', name: 'Coursera Plus - 12 Months', price: 110, category: 'Education', imageUrl: 'https://i.imgur.com/GMApA6s.png' },
  { id: 'grammarly-12-months', name: 'Grammarly Premium - 12 Months', price: 70, category: 'Productivity', imageUrl: 'https://i.imgur.com/Vl3DqaV.png' },
  { id: 'autodesk-all-apps-12-months', name: 'Autodesk All Apps - 12 Months', price: 400, category: 'Creative', imageUrl: 'https://i.imgur.com/J8B8w2Z.png' },
  { id: 'duolingo-plus-family-12-months', name: 'Duolingo Super - 12 Months', price: 70, category: 'Education', imageUrl: 'https://i.imgur.com/sZ0N5oP.png' },
  { id: 'jetbtains-all-apps-12-months', name: 'JetBrains All Apps - 12 Months', price: 100, category: 'Developer Tools', imageUrl: 'https://i.imgur.com/u1sTzLw.png' },
  { id: 'adobe-creative-cloud-12-months', name: 'Adobe Creative Cloud - 12 Months', price: 100, category: 'Creative', imageUrl: 'https://i.imgur.com/u1sTzLw.png' },
  { id: 'adobe-creative-cloud-lifetime', name: 'Adobe Creative Cloud - Lifetime', price: 200, category: 'Creative', imageUrl: 'https://i.imgur.com/4h4b4bH.png' },
  { id: 'gemini-claude-api', name: 'Gemini + Claude API - 1 Month', price: 100, category: 'AI', imageUrl: 'https://i.imgur.com/1GMS9S6.png' },
];

// ... (Tier definitions remain the same) ...
type TierName = 'Fixer' | 'Street Samurai' | 'Netrunner' | 'Free' | 'Admin';
const tierBenefits: Record<TierName, { discountRate: number }> = {
    'Admin': { discountRate: 1.0 },
    'Fixer': { discountRate: 0.30 },
    'Street Samurai': { discountRate: 0.15 },
    'Netrunner': { discountRate: 0.05 },
    'Free': { discountRate: 0 }
};

export default function StorePage() {
    const { data: session, status } = useSession(); // Use client-side session hook
    const [user, setUser] = useState<ExtendedUser | undefined>(undefined);
    
    useEffect(() => {
        if (status === 'authenticated') {
            setUser(session.user as ExtendedUser);
        }
    }, [status, session]);

    if (status === "loading") {
        return <div className="text-white text-center p-10 min-h-screen flex items-center justify-center">Loading...</div>;
    }
  
    if (status === "unauthenticated" || !user) {
        return <div className="text-white text-center p-10 min-h-screen flex items-center justify-center">Please log in to view the store.</div>;
    }
      
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
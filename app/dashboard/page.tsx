import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/session';

type TierName = 'Fixer' | 'Street Samurai' | 'Netrunner' | 'Free' | 'Admin';

const tierBenefits: Record<TierName, { discount: string; tokens: string; support: string; color: string; }> = {
  'Admin': { discount: '100%', tokens: 'Unlimited', support: 'Root Access', color: 'border-red-500' },
  'Fixer': { discount: '30%', tokens: '3,000,000', support: 'Priority Ticket + Private Discord', color: 'border-orange-500' },
  'Street Samurai': { discount: '15%', tokens: '1,000,000', support: 'Ticket + Private Discord', color: 'border-purple-500' },
  'Netrunner': { discount: '5%', tokens: '250,000', support: 'Ticket System', color: 'border-cyan-500' },
  'Free': { discount: '0%', tokens: '0', support: 'N/A', color: 'border-gray-600' }
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/');
  }
  
  const currentUserBenefits = tierBenefits[user.membershipTier as TierName];

  if (!currentUserBenefits) {
    return (
      <div className="text-white p-8 text-center">
        <h1>Error: Unknown membership tier. Please contact support.</h1>
        <Link href="/"><span className="text-cyan-400 hover:underline">Go back to Home</span></Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#0A0E1A] text-white font-sans p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold tracking-widest uppercase" style={{fontFamily: 'Orbitron, sans-serif'}}>
            EUDROP
          </h1>
          <div className="text-right">
            <p className="text-gray-400">Welcome back,</p>
            <p className="text-lg font-semibold text-cyan-400">{user.username}</p>
          </div>
        </header>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className={`p-6 rounded-2xl bg-gray-900 bg-opacity-70 border-2 ${currentUserBenefits.color} shadow-lg`}>
              <h2 className="text-3xl font-bold mb-2">{user.membershipTier}</h2>
              <p className="text-lg text-gray-300 mb-4">Membership Status</p>
              <div className="space-y-3">
                <p><strong>Store Discount:</strong> <span className="font-mono text-green-400">{currentUserBenefits.discount}</span></p>
                <p><strong>Monthly AI Tokens:</strong> <span className="font-mono text-green-400">{currentUserBenefits.tokens}</span></p>
                <p><strong>Support Level:</strong> <span className="font-mono text-green-400">{currentUserBenefits.support}</span></p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="p-6 rounded-2xl bg-gray-900 bg-opacity-70 border border-gray-700">
              <h2 className="text-2xl font-bold mb-6 text-pink-400">Main Cockpit</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link href="/store"><div className="p-4 rounded-lg bg-gray-800 text-center cursor-pointer hover:bg-cyan-900 transition h-full flex flex-col justify-center"><h3 className="text-xl font-bold">Store</h3><p className="text-gray-400 mt-1">Access A La Carte products</p></div></Link>
                <div className="p-4 rounded-lg bg-gray-800 text-center cursor-not-allowed opacity-50 h-full flex flex-col justify-center"><h3 className="text-xl font-bold">AI Tools</h3><p className="text-gray-400 mt-1">Use your token credits</p></div>
                <div className="p-4 rounded-lg bg-gray-800 text-center cursor-not-allowed opacity-50 h-full flex flex-col justify-center"><h3 className="text-xl font-bold">Support</h3><p className="text-gray-400 mt-1">Open a new ticket</p></div>
                <Link href="/memberships"><div className="p-4 rounded-lg bg-green-800 text-center cursor-pointer hover:bg-green-700 transition h-full flex flex-col justify-center border-2 border-green-500"><h3 className="text-xl font-bold">Upgrade Membership</h3><p className="text-gray-400 mt-1">Unlock new tiers</p></div></Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
'use client';
import { useState, FormEvent } from 'react'; // React'in tipini doğrudan import etmek daha temiz bir yöntem.
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // HATA BURADAYDI: React._FormEvent yerine FormEvent kullanıyoruz.
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('Creating account...');

    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await response.json();

    if (response.ok) {
        setMessage('Success! You can now log in.');
        setActiveTab('login');
    } else {
        setMessage(data.message);
    }
    setIsLoading(false);
  };

  // HATA BURADAYDI: React._FormEvent yerine FormEvent kullanıyoruz.
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('Attempting to log in...');

    const result = await signIn('credentials', {
      redirect: false,
      email: email,
      password: password,
    });

    setIsLoading(false);

    if (result?.error) {
      setMessage('Invalid Credentials');
    } else {
      setMessage('Login successful! Redirecting...');
      router.push('/dashboard');
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-[#0A0E1A] text-white font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 bg-opacity-70 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-widest text-white uppercase" style={{fontFamily: 'Orbitron, sans-serif'}}>EUDROP</h1>
          <p className="mt-2 text-gray-400">Authenticate to access the cockpit.</p>
        </div>
        <div className="flex border-b border-gray-700">
          <button onClick={() => setActiveTab('login')} className={`flex-1 py-2 text-lg font-semibold uppercase tracking-wider transition-colors duration-300 ${activeTab === 'login' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500'}`}>Login</button>
          <button onClick={() => setActiveTab('register')} className={`flex-1 py-2 text-lg font-semibold uppercase tracking-wider transition-colors duration-300 ${activeTab === 'register' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500'}`}>Register</button>
        </div>
        <div>
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"/></div>
              <div><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"/></div>
              <button type="submit" disabled={isLoading} className="w-full px-4 py-3 font-bold text-white uppercase bg-cyan-600 rounded-md hover:bg-cyan-700 transition-colors duration-300 disabled:opacity-50">
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>
          )}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"/></div>
              <div><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"/></div>
              <div><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"/></div>
              <button type="submit" disabled={isLoading} className="w-full px-4 py-3 font-bold text-white uppercase bg-cyan-600 rounded-md hover:bg-cyan-700 transition-colors duration-300 disabled:opacity-50">
                {isLoading ? 'Creating...' : 'Create Account'}
              </button>
            </form>
          )}
          {message && <p className={`mt-4 text-center font-bold ${message.includes('successful') || message.includes('Success!') ? 'text-green-400' : 'text-red-500'}`}>{message}</p>}
        </div>
      </div>
    </main>
  );
}
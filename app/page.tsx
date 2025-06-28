'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Yönlendirme için gerekli

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('login');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter(); // Yönlendiriciyi kullanıma hazırlıyoruz

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Creating account...');
    // ... (Kayıt olma kodu aynı kalıyor) ...
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await response.json();
    setMessage(data.message);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('Attempting to log in...');
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.success) {
      setMessage('Login successful! Redirecting...');
      // Başarılı giriş sonrası sayfayı yenileyerek cookie'nin okunmasını sağlıyoruz
      // ve Next.js'in bizi korumalı sayfaya yönlendirmesine izin veriyoruz.
      window.location.href = '/dashboard'; 
    } else {
      setMessage(data.message);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-[#0A0E1A] text-white font-sans">
      <div className="w-full max-w-md p-8 space-y-6 bg-gray-900 bg-opacity-70 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-sm">
        {/* ... Başlık ve Sekmeler aynı kalıyor ... */}
        <div className="text-center"><h1 className="text-4xl font-bold tracking-widest text-white uppercase" style={{fontFamily: 'Orbitron, sans-serif'}}>EUDROP</h1><p className="mt-2 text-gray-400">Authenticate to access the cockpit.</p></div>
        <div className="flex border-b border-gray-700"><button onClick={() => {setActiveTab('login'); setMessage('');}} className={`flex-1 py-2 text-lg font-semibold uppercase tracking-wider transition-colors duration-300 ${activeTab === 'login' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500'}`}>Login</button><button onClick={() => {setActiveTab('register'); setMessage('');}} className={`flex-1 py-2 text-lg font-semibold uppercase tracking-wider transition-colors duration-300 ${activeTab === 'register' ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-gray-500'}`}>Register</button></div>
        {/* Form Alanı */}
        <div>
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"/></div>
              <div><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"/></div>
              <button type="submit" className="w-full px-4 py-3 font-bold text-white uppercase bg-cyan-600 rounded-md hover:bg-cyan-700 transition-colors duration-300">Sign In</button>
            </form>
          )}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              {/* ... Kayıt olma form alanları aynı kalıyor ... */}
              <div><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"/></div>
              <div><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email Address" required className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"/></div>
              <div><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"/></div>
              <button type="submit" className="w-full px-4 py-3 font-bold text-white uppercase bg-cyan-600 rounded-md hover:bg-cyan-700 transition-colors duration-300">Create Account</button>
            </form>
          )}
          {message && <p className={`mt-4 text-center font-bold ${message.includes('successful') ? 'text-green-400' : 'text-red-500'}`}>{message}</p>}
        </div>
      </div>
    </main>
  );
}
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/config';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/packages');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="blue-gradient flex items-center justify-center min-h-screen px-4">
      <div className="bg-white/20 backdrop-blur-md rounded-3xl p-6 md:p-12 w-full max-w-md">
        <h1 className="text-white text-4xl font-semibold mb-8 text-center">Login</h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 rounded-xl bg-white/30 backdrop-blur-sm text-white placeholder-white/70 border-none outline-none focus:ring-2 focus:ring-white/50"
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-4 rounded-xl bg-white/30 backdrop-blur-sm text-white placeholder-white/70 border-none outline-none focus:ring-2 focus:ring-white/50"
            required
          />

          <button
            type="submit"
            className="w-full px-6 py-4 rounded-xl bg-gradient-to-b from-blue-800 to-blue-900 text-white font-semibold hover:from-blue-900 hover:to-blue-950 transition-all shadow-lg"
          >
            Login
          </button>
        </form>

        <p className="text-white text-center mt-6">
          Don't have account?{' '}
          <Link href="/signup" className="font-semibold hover:underline">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}

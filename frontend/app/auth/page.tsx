'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/config';

export default function Auth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const toggleMode = () => {
    resetForm();
    setIsLogin(!isLogin);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? 'login' : 'signup';
      const response = await fetch(`${API_URL}/api/auth/${endpoint}`, {
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
        setError(data.message || `${isLogin ? 'Login' : 'Signup'} failed`);
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blue-gradient flex items-center justify-center min-h-screen px-4">
      <div
        className={`bg-white/20 backdrop-blur-md rounded-3xl p-6 md:p-12 w-full max-w-md transition-all duration-500 ease-in-out ${
          isLogin ? 'max-h-[480px]' : 'max-h-[580px]'
        }`}
        style={{ overflow: 'hidden' }}
      >
        <h1
          className="text-white text-4xl font-semibold mb-8 text-center transition-all duration-300"
        >
          {isLogin ? 'Login' : 'Signup'}
        </h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-3 rounded-xl mb-6 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-6 py-4 rounded-xl bg-white/30 backdrop-blur-sm text-white placeholder-white/70 border-none outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
            required
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-6 py-4 rounded-xl bg-white/30 backdrop-blur-sm text-white placeholder-white/70 border-none outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
            required
          />

          <div
            className={`transition-all duration-500 ease-in-out overflow-hidden ${
              isLogin ? 'max-h-0 opacity-0' : 'max-h-20 opacity-100'
            }`}
          >
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-xl bg-white/30 backdrop-blur-sm text-white placeholder-white/70 border-none outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300"
              required={!isLogin}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 rounded-xl bg-gradient-to-b from-blue-800 to-blue-900 text-white font-semibold hover:from-blue-900 hover:to-blue-950 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && (
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            )}
            {loading
              ? (isLogin ? 'Logging in...' : 'Creating account...')
              : (isLogin ? 'Login' : 'Signup')
            }
          </button>
        </form>

        <p className="text-white text-center mt-6">
          {isLogin ? "Don't have account? " : 'Already have an account? '}
          <button
            onClick={toggleMode}
            className="font-semibold hover:underline transition-all"
          >
            {isLogin ? 'Signup' : 'Login'}
          </button>
        </p>

        <Link
          href="/"
          className="block text-white/70 text-center mt-4 hover:text-white transition-all text-sm"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

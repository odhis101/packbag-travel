'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navigation() {
  const router = useRouter();
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="flex items-center justify-center px-4 md:px-8 py-4 md:py-6">
      <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 md:px-12 py-3 md:py-4 flex items-center gap-4 md:gap-12 w-full max-w-4xl">
        <Link href="/" className="text-white text-lg md:text-2xl font-bold">PackBag</Link>
        <div className="flex gap-3 md:gap-8 ml-auto items-center flex-wrap justify-end">
          <Link href="/packages" className="text-white hover:text-gray-200 transition text-sm md:text-base">
            Packages
          </Link>

          {user ? (
            <>
              <Link href="/my-bookings" className="text-white hover:text-gray-200 transition text-sm md:text-base hidden sm:block">
                My Bookings
              </Link>
              <span className="text-white/80 text-xs md:text-sm hidden md:block">{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-white hover:text-gray-200 transition px-3 py-1.5 md:px-4 md:py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm md:text-base"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/signup" className="text-white hover:text-gray-200 transition text-sm md:text-base">
                Signup
              </Link>
              <Link href="/login" className="text-white hover:text-gray-200 transition text-sm md:text-base">
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth');
  }, [router]);

  return (
    <div className="blue-gradient flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
    </div>
  );
}

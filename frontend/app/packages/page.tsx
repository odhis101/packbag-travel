'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { API_URL } from '@/lib/config';

interface Package {
  _id: string;
  title: string;
  destination: string;
  description: string;
  price: number;
  duration: string;
  image: string;
}

export default function Packages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const response = await fetch(`${API_URL}/api/packages`);
      const data = await response.json();
      setPackages(data.packages);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="blue-gradient min-h-screen">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
        <h1 className="text-white text-3xl md:text-5xl font-bold mb-6 md:mb-8">Explore Packages</h1>

        {loading ? (
          <div className="text-white text-center py-20">Loading packages...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg._id}
                className="bg-white/20 backdrop-blur-md rounded-2xl overflow-hidden hover:scale-105 transition-transform"
              >
                <div className="h-48 bg-white/30 flex items-center justify-center">
                  <span className="text-white/50">Image Placeholder</span>
                </div>

                <div className="p-6">
                  <h3 className="text-white text-2xl font-bold mb-2">{pkg.title}</h3>
                  <p className="text-white/80 text-sm mb-4">{pkg.destination}</p>
                  <p className="text-white/90 mb-4">{pkg.description}</p>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-white font-semibold">${pkg.price}</span>
                    <span className="text-white/80 text-sm">{pkg.duration}</span>
                  </div>

                  <Link
                    href={`/packages/${pkg._id}`}
                    className="block w-full text-center px-6 py-3 rounded-xl bg-gradient-to-b from-blue-800 to-blue-900 text-white font-semibold hover:from-blue-900 hover:to-blue-950 transition-all"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

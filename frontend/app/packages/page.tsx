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
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredPackages = packages.filter(
    (pkg) =>
      pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="blue-gradient min-h-screen">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
          <h1 className="text-white text-3xl md:text-5xl font-bold">Explore Packages</h1>

          <div className="relative">
            <input
              type="text"
              placeholder="Search by title or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 px-5 py-3 pl-12 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/60 border border-white/30 outline-none focus:ring-2 focus:ring-white/50"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
            <p className="text-white text-lg">Loading packages...</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 md:p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto text-white/50 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <h2 className="text-white text-2xl font-bold mb-2">No Packages Available</h2>
            <p className="text-white/70">Check back soon for exciting travel packages!</p>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 md:p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto text-white/50 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h2 className="text-white text-2xl font-bold mb-2">No Results Found</h2>
            <p className="text-white/70">No packages match "{searchQuery}". Try a different search.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-4 px-6 py-2 rounded-xl bg-white/20 text-white hover:bg-white/30 transition"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg) => (
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

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import { API_URL } from '@/lib/config';

function resolveImage(url: string) {
  if (!url) return '';
  return url.startsWith('/uploads') ? `${API_URL}${url}` : url;
}

interface City {
  name: string;
  slug: string;
  image: string;
  packageCount: number;
}

export default function Packages() {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCities();
  }, []);

  const fetchCities = async () => {
    try {
      const response = await fetch(`${API_URL}/api/packages/cities`);
      const data = await response.json();
      setCities(data.cities ?? []);
    } catch (error) {
      console.error('Error fetching cities:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCities = (cities ?? []).filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="blue-gradient min-h-screen">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 md:mb-12">
          <div>
            <h1 className="text-white text-3xl md:text-5xl font-bold">Packages</h1>
            <p className="text-white/60 mt-1">Choose a destination to explore</p>
          </div>

          <div className="relative">
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-72 px-5 py-3 pl-12 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/50 border border-white/20 outline-none focus:ring-2 focus:ring-white/40"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
            <p className="text-white/70">Loading destinations...</p>
          </div>
        ) : (cities ?? []).length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-white text-2xl font-bold mb-2">No Destinations Yet</h2>
            <p className="text-white/50">Check back soon for exciting travel packages!</p>
          </div>
        ) : filteredCities.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-12 text-center">
            <h2 className="text-white text-2xl font-bold mb-2">No Results</h2>
            <p className="text-white/50 mb-4">No destinations match &quot;{searchQuery}&quot;</p>
            <button
              onClick={() => setSearchQuery('')}
              className="px-6 py-2 rounded-xl bg-white/20 text-white hover:bg-white/30 transition"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city) => (
              <Link
                key={city.slug}
                href={`/packages/city/${city.slug}`}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] block hover:scale-[1.02] transition-transform duration-300"
              >
                {city.image ? (
                  <img
                    src={resolveImage(city.image)}
                    alt={city.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-blue-900" />
                )}

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <h2 className="text-white text-3xl font-bold tracking-tight">{city.name}</h2>
                  <p className="text-white/70 text-sm mt-1">
                    {city.packageCount} {city.packageCount === 1 ? 'package' : 'packages'} available
                  </p>
                </div>

                {/* Hover arrow */}
                <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

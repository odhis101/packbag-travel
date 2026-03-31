'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navigation from '../../../components/Navigation';
import { API_URL } from '@/lib/config';

function resolveImage(url: string) {
  if (!url) return '';
  return url.startsWith('/uploads') ? `${API_URL}${url}` : url;
}

interface Package {
  _id: string;
  title: string;
  city: string;
  tier: 'Luxury' | 'Mid-Range' | 'Budget';
  description: string;
  price: number;
  duration: string;
  images: string[];
  image: string;
  included: string[];
}

const TIERS = ['Luxury', 'Mid-Range', 'Budget'] as const;

const TIER_META: Record<string, { icon: string; tagline: string; color: string }> = {
  Luxury: {
    icon: '✦',
    tagline: 'Premium experiences, world-class comfort',
    color: 'from-yellow-500/20 to-amber-600/10 border-yellow-400/30',
  },
  'Mid-Range': {
    icon: '◈',
    tagline: 'Quality stays and curated experiences',
    color: 'from-blue-500/20 to-blue-600/10 border-blue-400/30',
  },
  Budget: {
    icon: '◇',
    tagline: 'Smart travel, real adventures',
    color: 'from-green-500/20 to-emerald-600/10 border-green-400/30',
  },
};

export default function CityPage() {
  const params = useParams();
  const cityName = decodeURIComponent(params.city as string);

  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPackages();
  }, [cityName]);

  const fetchPackages = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/packages?city=${encodeURIComponent(cityName)}`
      );
      const data = await response.json();
      setPackages(data.packages || []);
    } catch (error) {
      console.error('Error fetching packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPackageForTier = (tier: string) =>
    packages.find((p) => p.tier === tier);

  const coverImage =
    packages.find((p) => p.images && p.images.length > 0)?.images[0] ||
    packages.find((p) => p.image)?.image ||
    '';

  return (
    <div className="blue-gradient min-h-screen">
      <Navigation />

      {/* Hero */}
      <div className="relative h-64 md:h-96 overflow-hidden">
        {coverImage ? (
          <img
            src={resolveImage(coverImage)}
            alt={cityName}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-700 to-blue-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-8 pb-8 max-w-7xl mx-auto">
          <Link href="/packages" className="text-white/70 hover:text-white text-sm mb-3 inline-flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            All Destinations
          </Link>
          <h1 className="text-white text-4xl md:text-6xl font-bold tracking-tight">
            {cityName}
          </h1>
          <p className="text-white/70 mt-1">Select your package tier</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
            <p className="text-white/70">Loading packages...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map((tier) => {
              const pkg = getPackageForTier(tier);
              const meta = TIER_META[tier];

              if (!pkg) {
                return (
                  <div
                    key={tier}
                    className={`rounded-2xl border bg-gradient-to-br ${meta.color} backdrop-blur-md p-8 opacity-40`}
                  >
                    <div className="text-3xl mb-3">{meta.icon}</div>
                    <h2 className="text-white text-2xl font-bold mb-1">{tier}</h2>
                    <p className="text-white/60 text-sm mb-6">{meta.tagline}</p>
                    <p className="text-white/50 text-sm">Not available for {cityName}</p>
                  </div>
                );
              }

              const thumbImage =
                (pkg.images && pkg.images.length > 0 ? pkg.images[0] : null) ||
                pkg.image ||
                '';

              return (
                <Link
                  key={tier}
                  href={`/packages/${pkg._id}`}
                  className={`group rounded-2xl border bg-gradient-to-br ${meta.color} backdrop-blur-md overflow-hidden hover:scale-[1.02] transition-transform duration-300 block`}
                >
                  {/* Thumbnail */}
                  <div className="h-44 relative overflow-hidden">
                    {thumbImage ? (
                      <img
                        src={resolveImage(thumbImage)}
                        alt={pkg.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/10 flex items-center justify-center">
                        <span className="text-5xl opacity-30">{meta.icon}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{meta.icon}</span>
                      <h2 className="text-white text-2xl font-bold">{tier}</h2>
                    </div>
                    <p className="text-white/60 text-sm mb-4">{meta.tagline}</p>

                    <h3 className="text-white font-semibold mb-1">{pkg.title}</h3>
                    <p className="text-white/70 text-sm mb-5 line-clamp-2">{pkg.description}</p>

                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-white/50 text-xs">From</span>
                        <div className="text-white text-2xl font-bold">${pkg.price.toLocaleString()}</div>
                        <span className="text-white/50 text-xs">per person · {pkg.duration}</span>
                      </div>
                      <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

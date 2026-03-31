'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navigation from '../../components/Navigation';
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
  destination: string;
  description: string;
  price: number;
  duration: string;
  images: string[];
  image: string;
  included: string[];
  restaurants: { name: string; description: string; cuisine?: string }[];
  attractions: { name: string; description: string }[];
  itinerary: { day: number; title: string; description: string }[];
}

const TIER_COLORS: Record<string, string> = {
  Luxury: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
  'Mid-Range': 'bg-blue-500/20 text-blue-300 border-blue-400/30',
  Budget: 'bg-green-500/20 text-green-300 border-green-400/30',
};

export default function PackageDetails() {
  const params = useParams();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    fetchPackageDetails();
  }, [params.id]);

  const fetchPackageDetails = async () => {
    try {
      const response = await fetch(`${API_URL}/api/packages/${params.id}`);
      const data = await response.json();
      setPkg(data.package);
    } catch (error) {
      console.error('Error fetching package details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please login to book a package');
      return;
    }

    if (!pkg) return;

    setBooking(true);

    try {
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          packageId: pkg._id,
          numberOfGuests,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Booking successful! Total: $${data.booking.totalPrice.toLocaleString()}`);
      } else {
        alert(data.message || 'Booking failed');
      }
    } catch {
      alert('Network error. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="blue-gradient min-h-screen flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
        <p className="text-white text-lg">Loading package details...</p>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="blue-gradient min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Package not found</div>
      </div>
    );
  }

  const allImages = pkg.images && pkg.images.length > 0 ? pkg.images : pkg.image ? [pkg.image] : [];
  const citySlug = pkg.city ? encodeURIComponent(pkg.city) : null;

  return (
    <div className="blue-gradient min-h-screen">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-12">
        <Link
          href={citySlug ? `/packages/city/${citySlug}` : '/packages'}
          className="text-white/70 hover:text-white mb-6 inline-flex items-center gap-1 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {pkg.city || 'Back'}
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {/* Image gallery */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden">
              <div className="relative h-72 md:h-96">
                {allImages.length > 0 ? (
                  <img
                    src={resolveImage(allImages[activeImage])}
                    alt={pkg.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-white/10 flex items-center justify-center">
                    <span className="text-white/30 text-lg">No image available</span>
                  </div>
                )}
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage((i) => (i - 1 + allImages.length) % allImages.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setActiveImage((i) => (i + 1) % allImages.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/60 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {allImages.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveImage(i)}
                          className={`w-2 h-2 rounded-full transition ${i === activeImage ? 'bg-white' : 'bg-white/40'}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              {allImages.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition ${i === activeImage ? 'border-white' : 'border-transparent opacity-60 hover:opacity-90'}`}
                    >
                      <img src={resolveImage(img)} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div className="p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {pkg.city && (
                    <span className="text-white/60 text-sm">{pkg.city}</span>
                  )}
                  {pkg.tier && (
                    <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${TIER_COLORS[pkg.tier]}`}>
                      {pkg.tier}
                    </span>
                  )}
                </div>
                <h1 className="text-white text-3xl md:text-4xl font-bold mb-3">{pkg.title}</h1>
                {pkg.destination && (
                  <p className="text-white/60 text-sm mb-3">{pkg.destination}</p>
                )}
                <p className="text-white/80 text-lg leading-relaxed">{pkg.description}</p>
              </div>
            </div>

            {/* What's Included */}
            {pkg.included && pkg.included.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8">
                <h2 className="text-white text-xl font-bold mb-4">What&apos;s Included</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {pkg.included.map((item, index) => (
                    <li key={index} className="text-white/80 flex items-start gap-2 text-sm">
                      <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Restaurants */}
            {pkg.restaurants && pkg.restaurants.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8">
                <h2 className="text-white text-xl font-bold mb-4">Restaurants</h2>
                <div className="space-y-4">
                  {pkg.restaurants.map((r, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-9 h-9 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center text-white/50">
                        🍽
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-semibold">{r.name}</h3>
                          {r.cuisine && (
                            <span className="text-white/40 text-xs">{r.cuisine}</span>
                          )}
                        </div>
                        <p className="text-white/60 text-sm mt-0.5">{r.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attractions */}
            {pkg.attractions && pkg.attractions.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8">
                <h2 className="text-white text-xl font-bold mb-4">Attractions</h2>
                <div className="space-y-4">
                  {pkg.attractions.map((a, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-9 h-9 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center text-white/50">
                        📍
                      </div>
                      <div>
                        <h3 className="text-white font-semibold">{a.name}</h3>
                        <p className="text-white/60 text-sm mt-0.5">{a.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary */}
            {pkg.itinerary && pkg.itinerary.length > 0 && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8">
                <h2 className="text-white text-xl font-bold mb-4">Itinerary</h2>
                <div className="space-y-4">
                  {pkg.itinerary.map((day) => (
                    <div key={day.day} className="flex gap-4">
                      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="text-white/70 text-xs font-bold">{day.day}</span>
                      </div>
                      <div className="border-l border-white/10 pl-4">
                        <h3 className="text-white font-semibold">Day {day.day}: {day.title}</h3>
                        <p className="text-white/60 text-sm mt-0.5">{day.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 sticky top-8">
              <h2 className="text-white text-xl font-bold mb-6">Book This Package</h2>

              <div className="mb-6 space-y-2">
                <div className="flex justify-between text-white/70 text-sm">
                  <span>Price per person</span>
                  <span className="text-white font-bold text-2xl">${pkg.price.toLocaleString()}</span>
                </div>
                <div className="text-white/50 text-sm text-right">Duration: {pkg.duration}</div>
              </div>

              <div className="mb-6">
                <label className="text-white/70 text-sm block mb-2">Number of Guests</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 text-white border border-white/20 outline-none focus:ring-2 focus:ring-white/30"
                />
              </div>

              <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex justify-between text-white/70 text-sm mb-2">
                  <span>${pkg.price.toLocaleString()} × {numberOfGuests} guest{numberOfGuests > 1 ? 's' : ''}</span>
                  <span>${(pkg.price * numberOfGuests).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span>${(pkg.price * numberOfGuests).toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={booking}
                className="w-full px-6 py-4 rounded-xl bg-gradient-to-b from-blue-600 to-blue-800 text-white font-semibold hover:from-blue-700 hover:to-blue-900 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {booking && (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                )}
                {booking ? 'Processing...' : 'Book Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

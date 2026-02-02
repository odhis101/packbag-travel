'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navigation from '../../components/Navigation';
import { API_URL } from '@/lib/config';

interface Package {
  _id: string;
  title: string;
  destination: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  included: string[];
  itinerary: { day: number; title: string; description: string }[];
}

export default function PackageDetails() {
  const params = useParams();
  const [pkg, setPkg] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [numberOfGuests, setNumberOfGuests] = useState(1);

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
        alert(`Booking successful! Total: $${data.booking.totalPrice}`);
      } else {
        alert(data.message || 'Booking failed');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="blue-gradient min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
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

  return (
    <div className="blue-gradient min-h-screen">
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-12">
        <Link href="/packages" className="text-white hover:text-gray-200 mb-4 md:mb-6 inline-block text-sm md:text-base">
          ← Back to Packages
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl overflow-hidden">
              <div className="h-96 bg-white/30 flex items-center justify-center">
                <span className="text-white/50 text-xl">Image Placeholder</span>
              </div>

              <div className="p-8">
                <h1 className="text-white text-4xl font-bold mb-2">{pkg.title}</h1>
                <p className="text-white/80 text-lg mb-4">{pkg.destination}</p>
                <p className="text-white/90 text-lg">{pkg.description}</p>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8">
              <h2 className="text-white text-2xl font-bold mb-4">What's Included</h2>
              <ul className="space-y-2">
                {pkg.included.map((item, index) => (
                  <li key={index} className="text-white/90 flex items-center gap-2">
                    <span className="text-green-300">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8">
              <h2 className="text-white text-2xl font-bold mb-4">Itinerary</h2>
              <div className="space-y-4">
                {pkg.itinerary.map((day) => (
                  <div key={day.day} className="border-l-2 border-white/30 pl-4">
                    <h3 className="text-white font-semibold">Day {day.day}: {day.title}</h3>
                    <p className="text-white/80">{day.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/20 backdrop-blur-md rounded-2xl p-8 sticky top-8">
              <h2 className="text-white text-2xl font-bold mb-4">Book This Package</h2>

              <div className="mb-6">
                <div className="flex justify-between text-white mb-2">
                  <span>Price per person:</span>
                  <span className="font-bold text-2xl">${pkg.price}</span>
                </div>
                <div className="text-white/80">Duration: {pkg.duration}</div>
              </div>

              <div className="mb-6">
                <label className="text-white block mb-2">Number of Guests</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={numberOfGuests}
                  onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-white/30 backdrop-blur-sm text-white border-none outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>

              <div className="mb-6 p-4 bg-white/10 rounded-xl">
                <div className="flex justify-between text-white mb-2">
                  <span>Subtotal:</span>
                  <span>${pkg.price * numberOfGuests}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-xl mt-2 pt-2 border-t border-white/30">
                  <span>Total:</span>
                  <span>${pkg.price * numberOfGuests}</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                className="w-full px-6 py-4 rounded-xl bg-gradient-to-b from-blue-800 to-blue-900 text-white font-semibold hover:from-blue-900 hover:to-blue-950 transition-all shadow-lg"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

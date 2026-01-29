'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '../components/Navigation';
import { API_URL } from '@/lib/config';

interface Booking {
  _id: string;
  package: {
    title: string;
    destination: string;
  };
  numberOfGuests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookingDate: string;
}

export default function MyBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/api/bookings/my-bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setBookings(data.bookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${API_URL}/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert('Booking cancelled successfully');
        fetchBookings();
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-200 border-yellow-500/50';
      case 'confirmed':
        return 'bg-green-500/20 text-green-200 border-green-500/50';
      case 'cancelled':
        return 'bg-red-500/20 text-red-200 border-red-500/50';
      default:
        return 'bg-gray-500/20 text-gray-200 border-gray-500/50';
    }
  };

  if (loading) {
    return (
      <div className="blue-gradient min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-white text-2xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="blue-gradient min-h-screen">
      <Navigation />

      <div className="max-w-7xl mx-auto px-8 py-12">
        <h1 className="text-white text-5xl font-bold mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="bg-white/20 backdrop-blur-md rounded-2xl p-12 text-center">
            <p className="text-white text-xl mb-4">You haven't made any bookings yet</p>
            <a
              href="/packages"
              className="inline-block px-6 py-3 rounded-xl bg-gradient-to-b from-blue-800 to-blue-900 text-white font-semibold hover:from-blue-900 hover:to-blue-950 transition-all"
            >
              Browse Packages
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white/20 backdrop-blur-md rounded-2xl p-6 flex justify-between items-center"
              >
                <div className="flex-1">
                  <h3 className="text-white text-2xl font-bold mb-2">
                    {booking.package.title}
                  </h3>
                  <p className="text-white/80 mb-2">{booking.package.destination}</p>
                  <div className="flex gap-4 text-white/90">
                    <span>Guests: {booking.numberOfGuests}</span>
                    <span>•</span>
                    <span>Total: ${booking.totalPrice}</span>
                    <span>•</span>
                    <span>
                      Booked: {new Date(booking.bookingDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status.toUpperCase()}
                  </span>

                  {booking.status === 'pending' && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

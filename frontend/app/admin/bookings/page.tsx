'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Booking {
  _id: string;
  package: {
    title: string;
    destination: string;
  };
  user: {
    email: string;
  };
  numberOfGuests: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  bookingDate: string;
}

export default function AdminBookings() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:5001/api/bookings', {
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

  const handleStatusUpdate = async (bookingId: string, newStatus: string) => {
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(
        `http://localhost:5001/api/bookings/${bookingId}/status`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (response.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/admin/login');
  };

  const filteredBookings =
    filter === 'all'
      ? bookings
      : bookings.filter((booking) => booking.status === filter);

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
      <div className="blue-gradient min-h-screen flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="blue-gradient min-h-screen">
      <nav className="bg-white/10 backdrop-blur-sm px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">PackBag Admin</h1>
          <div className="flex gap-4">
            <Link
              href="/admin/packages"
              className="text-white hover:text-gray-200 transition"
            >
              Packages
            </Link>
            <Link
              href="/admin/bookings"
              className="text-white hover:text-gray-200 transition"
            >
              Bookings
            </Link>
            <button
              onClick={handleLogout}
              className="text-white hover:text-gray-200 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-white text-4xl font-bold">Manage Bookings</h2>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'all'
                  ? 'bg-white text-blue-900'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('pending')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'pending'
                  ? 'bg-white text-blue-900'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('confirmed')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'confirmed'
                  ? 'bg-white text-blue-900'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Confirmed
            </button>
            <button
              onClick={() => setFilter('cancelled')}
              className={`px-4 py-2 rounded-lg transition ${
                filter === 'cancelled'
                  ? 'bg-white text-blue-900'
                  : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              Cancelled
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/20">
              <tr>
                <th className="text-left text-white px-6 py-4">Package</th>
                <th className="text-left text-white px-6 py-4">Customer</th>
                <th className="text-left text-white px-6 py-4">Guests</th>
                <th className="text-left text-white px-6 py-4">Total</th>
                <th className="text-left text-white px-6 py-4">Date</th>
                <th className="text-left text-white px-6 py-4">Status</th>
                <th className="text-left text-white px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="border-t border-white/10">
                  <td className="px-6 py-4">
                    <div className="text-white font-semibold">
                      {booking.package.title}
                    </div>
                    <div className="text-white/70 text-sm">
                      {booking.package.destination}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white">
                    {booking.user.email}
                  </td>
                  <td className="px-6 py-4 text-white">
                    {booking.numberOfGuests}
                  </td>
                  <td className="px-6 py-4 text-white font-semibold">
                    ${booking.totalPrice}
                  </td>
                  <td className="px-6 py-4 text-white/80 text-sm">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {booking.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleStatusUpdate(booking._id, 'confirmed')
                          }
                          className="px-3 py-1 rounded-lg bg-green-600 text-white text-sm hover:bg-green-700 transition"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() =>
                            handleStatusUpdate(booking._id, 'cancelled')
                          }
                          className="px-3 py-1 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredBookings.length === 0 && (
            <div className="text-white text-center py-12">
              No bookings found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

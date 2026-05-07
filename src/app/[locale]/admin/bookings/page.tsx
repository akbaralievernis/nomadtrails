"use client";
import { useEffect, useState } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Phone, 
  Mail, 
  Calendar,
  Users,
  Search
} from "lucide-react";

export default function BookingsManager() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/admin/bookings');
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      fetchBookings(); // Refresh
    } catch (err) {
      console.error(err);
    }
  };

  const statusColors: any = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-amber-100 text-amber-700",
    confirmed: "bg-emerald-100 text-emerald-700",
    cancelled: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 font-playfair">Booking Requests</h1>
        <p className="text-gray-500">Manage tour reservations and client communication.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-[10px] font-bold uppercase tracking-wider border-b border-gray-100">
                <th className="px-6 py-4">Client Info</th>
                <th className="px-6 py-4">Tour / Date</th>
                <th className="px-6 py-4">Guests</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center">Loading bookings...</td></tr>
              ) : bookings.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-gray-900">{b.full_name}</p>
                      <div className="flex flex-col gap-1 mt-1">
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Mail size={12} /> {b.email}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Phone size={12} /> {b.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-gray-800">{b.tour_name || 'General Inquiry'}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Calendar size={12} /> {b.preferred_date ? new Date(b.preferred_date).toLocaleDateString() : 'TBD'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                      <Users size={14} /> {b.guests}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[b.status]}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => updateStatus(b.id, 'confirmed')}
                        className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all" 
                        title="Confirm Booking"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                      <button 
                        onClick={() => updateStatus(b.id, 'contacted')}
                        className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all" 
                        title="Mark as Contacted"
                      >
                        <Clock size={18} />
                      </button>
                      <button 
                        onClick={() => updateStatus(b.id, 'cancelled')}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                        title="Cancel Booking"
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

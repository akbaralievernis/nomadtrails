"use client";
import { useState } from "react";
import { CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";

export default function AdminBookingTable({ initialBookings, translations }: { initialBookings: any[], translations: any }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  async function updateStatus(bookingId: number, newStatus: string) {
    setLoadingId(bookingId);
    try {
      const res = await fetch("/api/admin/bookings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });
      if (res.ok) {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="overflow-x-auto">
      {/* Desktop Table */}
      <table className="w-full text-left hidden md:table">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 tracking-wider">{translations.table_id}</th>
            <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 tracking-wider">{translations.table_client}</th>
            <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 tracking-wider">{translations.table_item}</th>
            <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 tracking-wider">{translations.table_date}</th>
            <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 tracking-wider">{translations.table_status}</th>
            <th className="px-6 py-4 text-xs font-bold uppercase text-gray-500 tracking-wider">{translations.table_actions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {bookings.map((booking: any) => (
            <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{booking.id}</td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900">{booking.full_name}</span>
                  <span className="text-xs text-gray-500">{booking.email}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                 <div className="flex items-center gap-2">
                   <span className="text-sm font-bold text-gray-900">
                     {booking.tour_name || booking.hotel_name || booking.transport_title}
                   </span>
                   <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full uppercase font-bold">
                     {booking.item_type}
                   </span>
                 </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col text-sm text-gray-600">
                  <span>{new Date(booking.preferred_date).toLocaleDateString()}</span>
                  <span className="text-xs text-gray-400">{booking.guests} {translations.guests}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                  booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {booking.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex gap-2">
                  <button 
                    onClick={() => updateStatus(booking.id, 'confirmed')}
                    disabled={loadingId === booking.id || booking.status === 'confirmed'}
                    className="p-2 rounded-xl bg-green-50 text-green-600 hover:bg-green-500 hover:text-white disabled:opacity-30 transition-all shadow-sm"
                    title={translations.action_confirm}
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button 
                    onClick={() => updateStatus(booking.id, 'cancelled')}
                    disabled={loadingId === booking.id || booking.status === 'cancelled'}
                    className="p-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-500 hover:text-white disabled:opacity-30 transition-all shadow-sm"
                    title={translations.action_cancel}
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Card Layout */}
      <div className="md:hidden grid gap-4 p-4 bg-gray-50/50">
        {bookings.map((booking: any) => (
          <div key={booking.id} className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">#{booking.id}</p>
                <h4 className="font-bold text-[#0d1117]">{booking.full_name}</h4>
                <p className="text-xs text-gray-500">{booking.email}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {booking.status}
              </span>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">{translations.table_item}</p>
              <p className="text-sm font-bold text-[#1a3d2b]">{booking.tour_name || booking.hotel_name || booking.transport_title}</p>
              <div className="flex gap-4 mt-2 text-[11px] text-gray-500">
                <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(booking.preferred_date).toLocaleDateString()}</span>
                <span className="flex items-center gap-1"><Clock size={12} /> {booking.guests} {translations.guests}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => updateStatus(booking.id, 'confirmed')}
                className="flex-1 py-3 bg-green-50 text-green-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
              >
                <CheckCircle size={16} /> {translations.action_confirm}
              </button>
              <button 
                onClick={() => updateStatus(booking.id, 'cancelled')}
                className="flex-1 py-3 bg-red-50 text-red-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
              >
                <XCircle size={16} /> {translations.action_cancel}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

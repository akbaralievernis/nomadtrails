"use client";
import { useState } from "react";
import { CheckCircle, XCircle, Calendar, Clock } from "lucide-react";

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
            <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400 tracking-widest">{translations.table_id}</th>
            <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400 tracking-widest">{translations.table_client}</th>
            <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400 tracking-widest">{translations.table_item}</th>
            <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400 tracking-widest">{translations.table_date}</th>
            <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400 tracking-widest">{translations.table_status}</th>
            <th className="px-6 py-4 text-xs font-bold uppercase text-gray-400 tracking-widest">{translations.table_actions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {bookings.map((booking: any) => (
            <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
              <td className="px-6 py-6 whitespace-nowrap text-xs font-black text-gray-300">#{booking.id}</td>
              <td className="px-6 py-6">
                <div className="flex flex-col">
                  <span className="font-bold text-[#0d1117]">{booking.full_name}</span>
                  <span className="text-[11px] text-gray-400 font-medium">{booking.email}</span>
                </div>
              </td>
              <td className="px-6 py-6">
                 <div className="flex items-center gap-3">
                   <span className="text-sm font-bold text-[#1a3d2b] font-playfair">
                     {booking.tour_name || booking.hotel_name || booking.transport_title}
                   </span>
                   <span className="text-[9px] bg-[#1a3d2b]/5 text-[#1a3d2b] px-2 py-0.5 rounded-full uppercase font-black tracking-tighter">
                     {translations[booking.item_type] || booking.item_type}
                   </span>
                 </div>
              </td>
              <td className="px-6 py-6 whitespace-nowrap">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-bold text-gray-600">{new Date(booking.preferred_date).toLocaleDateString()}</span>
                  <span className="text-[10px] text-gray-400 font-bold uppercase">{booking.guests} {translations.guests}</span>
                </div>
              </td>
              <td className="px-6 py-6 whitespace-nowrap">
                <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                  booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                  booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {translations[`status_${booking.status}`] || booking.status}
                </span>
              </td>
              <td className="px-6 py-6 whitespace-nowrap">
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={() => updateStatus(booking.id, 'confirmed')}
                    disabled={loadingId === booking.id || booking.status === 'confirmed'}
                    className="p-2.5 rounded-xl bg-green-50 text-green-600 hover:bg-green-600 hover:text-white disabled:opacity-30 transition-all shadow-sm"
                    title={translations.action_confirm}
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button 
                    onClick={() => updateStatus(booking.id, 'cancelled')}
                    disabled={loadingId === booking.id || booking.status === 'cancelled'}
                    className="p-2.5 rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white disabled:opacity-30 transition-all shadow-sm"
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
      <div className="md:hidden grid gap-6 p-6 bg-gray-50/50">
        {bookings.map((booking: any) => (
          <div key={booking.id} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-xl shadow-black/[0.02]">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1">#{booking.id}</p>
                <h4 className="font-bold text-[#0d1117] text-lg font-playfair">{booking.full_name}</h4>
                <p className="text-xs text-gray-400">{booking.email}</p>
              </div>
              <span className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {translations[`status_${booking.status}`] || booking.status}
              </span>
            </div>
            
            <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100/50">
              <div className="flex justify-between items-center mb-3">
                 <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{translations.table_item}</p>
                 <span className="text-[9px] bg-[#1a3d2b]/10 text-[#1a3d2b] px-2 py-0.5 rounded-full uppercase font-black">{translations[booking.item_type] || booking.item_type}</span>
              </div>
              <p className="text-base font-bold text-[#1a3d2b] mb-4">{booking.tour_name || booking.hotel_name || booking.transport_title}</p>
              <div className="flex gap-6 text-[11px] text-gray-500 font-bold uppercase tracking-tight">
                <span className="flex items-center gap-2"><Calendar size={14} className="text-[#c9a84c]" /> {new Date(booking.preferred_date).toLocaleDateString()}</span>
                <span className="flex items-center gap-2"><Clock size={14} className="text-[#c9a84c]" /> {booking.guests} {translations.guests}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => updateStatus(booking.id, 'confirmed')}
                disabled={loadingId === booking.id || booking.status === 'confirmed'}
                className="flex-1 py-4 bg-[#1a3d2b] text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#1a3d2b]/20 disabled:opacity-50"
              >
                <CheckCircle size={16} /> {translations.action_confirm}
              </button>
              <button 
                onClick={() => updateStatus(booking.id, 'cancelled')}
                disabled={loadingId === booking.id || booking.status === 'cancelled'}
                className="flex-1 py-4 bg-red-50 text-red-600 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 disabled:opacity-50"
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

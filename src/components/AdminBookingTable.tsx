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
        <thead className="bg-white/5 border-b border-white/10">
          <tr>
            <th className="px-6 py-6 text-[10px] font-black uppercase text-white/30 tracking-[0.2em]">{translations.table_id}</th>
            <th className="px-6 py-6 text-[10px] font-black uppercase text-white/30 tracking-[0.2em]">{translations.table_client}</th>
            <th className="px-6 py-6 text-[10px] font-black uppercase text-white/30 tracking-[0.2em]">{translations.table_item}</th>
            <th className="px-6 py-6 text-[10px] font-black uppercase text-white/30 tracking-[0.2em]">{translations.table_date}</th>
            <th className="px-6 py-6 text-[10px] font-black uppercase text-white/30 tracking-[0.2em]">{translations.table_status}</th>
            <th className="px-6 py-6 text-[10px] font-black uppercase text-white/30 tracking-[0.2em]">{translations.table_actions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {bookings.map((booking: any) => (
            <tr key={booking.id} className="hover:bg-white/[0.03] transition-colors group">
              <td className="px-6 py-8 whitespace-nowrap text-[10px] font-black text-white/20 tracking-tighter">#{booking.id}</td>
              <td className="px-6 py-8">
                <div className="flex flex-col">
                  <span className="font-bold text-white text-base mb-1">{booking.full_name}</span>
                  <span className="text-xs text-emerald-400/50 font-medium">{booking.email}</span>
                </div>
              </td>
              <td className="px-6 py-8">
                 <div className="flex items-center gap-3">
                   <span className="text-sm font-bold text-white font-playfair">
                     {booking.tour_name || booking.hotel_name || booking.transport_title}
                   </span>
                   <span className="text-[9px] bg-white/5 text-[#c9a84c] px-2.5 py-1 rounded-full uppercase font-black tracking-widest border border-white/10">
                     {translations[booking.item_type] || booking.item_type}
                   </span>
                 </div>
              </td>
              <td className="px-6 py-8 whitespace-nowrap">
                <div className="flex flex-col gap-1.5">
                  <span className="text-sm font-bold text-white/70">{new Date(booking.preferred_date).toLocaleDateString()}</span>
                  <span className="text-[10px] text-white/30 font-black uppercase tracking-widest">{booking.guests} {translations.guests}</span>
                </div>
              </td>
              <td className="px-6 py-8 whitespace-nowrap">
                <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] shadow-lg ${
                  booking.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                  'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {translations[`status_${booking.status}`] || booking.status}
                </span>
              </td>
              <td className="px-6 py-8 whitespace-nowrap">
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
                  <button 
                    onClick={() => updateStatus(booking.id, 'confirmed')}
                    disabled={loadingId === booking.id || booking.status === 'confirmed'}
                    className="w-10 h-10 rounded-xl bg-white/5 text-emerald-400 hover:bg-emerald-500 hover:text-white disabled:opacity-10 transition-all border border-white/10 flex items-center justify-center"
                    title={translations.action_confirm}
                  >
                    <CheckCircle size={20} />
                  </button>
                  <button 
                    onClick={() => updateStatus(booking.id, 'cancelled')}
                    disabled={loadingId === booking.id || booking.status === 'cancelled'}
                    className="w-10 h-10 rounded-xl bg-white/5 text-red-400 hover:bg-red-500 hover:text-white disabled:opacity-10 transition-all border border-white/10 flex items-center justify-center"
                    title={translations.action_cancel}
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Card Layout */}
      <div className="md:hidden grid gap-8 p-6">
        {bookings.map((booking: any) => (
          <div key={booking.id} className="bg-white/5 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9a84c]/5 rounded-full blur-3xl -mr-16 -mt-16" />
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-2">#{booking.id}</p>
                <h4 className="font-bold text-white text-xl font-playfair mb-1">{booking.full_name}</h4>
                <p className="text-xs text-emerald-400/50">{booking.email}</p>
              </div>
              <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                booking.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                booking.status === 'cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}>
                {translations[`status_${booking.status}`] || booking.status}
              </span>
            </div>
            
            <div className="bg-black/40 rounded-3xl p-6 mb-8 border border-white/5 relative z-10">
              <div className="flex justify-between items-center mb-4">
                 <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">{translations.table_item}</p>
                 <span className="text-[9px] bg-white/5 text-[#c9a84c] px-3 py-1 rounded-full uppercase font-black border border-white/10">{translations[booking.item_type] || booking.item_type}</span>
              </div>
              <p className="text-lg font-bold text-white mb-6 font-playfair">{booking.tour_name || booking.hotel_name || booking.transport_title}</p>
              <div className="flex flex-wrap gap-6 text-[11px] text-white/50 font-black uppercase tracking-widest">
                <span className="flex items-center gap-3"><Calendar size={16} className="text-[#c9a84c]" /> {new Date(booking.preferred_date).toLocaleDateString()}</span>
                <span className="flex items-center gap-3"><Clock size={16} className="text-[#c9a84c]" /> {booking.guests} {translations.guests}</span>
              </div>
            </div>

            <div className="flex gap-4 relative z-10">
              <button 
                onClick={() => updateStatus(booking.id, 'confirmed')}
                disabled={loadingId === booking.id || booking.status === 'confirmed'}
                className="flex-1 py-5 bg-[#c9a84c] text-[#1a3d2b] rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-[#c9a84c]/10 disabled:opacity-30 transition-all active:scale-95"
              >
                <CheckCircle size={18} strokeWidth={3} /> {translations.action_confirm}
              </button>
              <button 
                onClick={() => updateStatus(booking.id, 'cancelled')}
                disabled={loadingId === booking.id || booking.status === 'cancelled'}
                className="flex-1 py-5 bg-white/5 text-red-400 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-30 transition-all"
              >
                <XCircle size={18} strokeWidth={3} /> {translations.action_cancel}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

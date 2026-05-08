"use client";
import { useState, useEffect } from "react";
import { Calendar, Map, Hotel, Truck, Plus, Trash2, Edit } from "lucide-react";
import AdminBookingTable from "./AdminBookingTable";

export default function AdminTabs({ initialBookings, translations, locale }: any) {
  const [activeTab, setActiveTab] = useState("bookings");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab !== "bookings") {
      fetchItems();
    }
  }, [activeTab]);

  async function fetchItems() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/${activeTab}`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function deleteItem(id: number) {
    if (!confirm(translations.confirm_delete)) return;
    try {
      const res = await fetch(`/api/admin/${activeTab}?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchItems();
    } catch (err) {
      console.error(err);
    }
  }

  const getActiveLabel = () => {
    if (activeTab === "tours") return translations.tab_tours;
    if (activeTab === "hotels") return translations.tab_hotels;
    return translations.tab_bookings;
  };

  return (
    <div className="bg-black/20 backdrop-blur-3xl min-h-[600px]">
      <div className="flex border-b border-white/5 overflow-x-auto bg-white/5 hide-scrollbar scroll-smooth">
        {[
          { id: "bookings", icon: Calendar, label: translations.tab_bookings },
          { id: "tours", icon: Map, label: translations.tab_tours },
          { id: "hotels", icon: Hotel, label: translations.tab_hotels },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-8 py-6 font-bold transition-all border-b-2 whitespace-nowrap text-xs uppercase tracking-[0.2em] ${
              activeTab === tab.id ? "border-[#c9a84c] text-[#c9a84c] bg-white/5 shadow-[0_-4px_0_inset_#c9a84c]" : "border-transparent text-white/30 hover:text-white/60 hover:bg-white/5"
            }`}
          >
            <tab.icon size={16} className={activeTab === tab.id ? "text-[#c9a84c]" : ""} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-8 md:p-14">
        {activeTab === "bookings" ? (
          <AdminBookingTable initialBookings={initialBookings} translations={translations} />
        ) : (
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 gap-6">
              <div>
                <h2 className="text-4xl font-playfair font-black text-white mb-2">{getActiveLabel()}</h2>
                <div className="h-1 w-20 bg-[#c9a84c] rounded-full" />
              </div>
              <button className="relative group overflow-hidden px-8 py-4 bg-[#c9a84c] text-[#1a3d2b] font-black text-[11px] uppercase tracking-widest rounded-2xl shadow-xl shadow-[#c9a84c]/20 transition-all hover:scale-105 active:scale-95">
                <span className="relative z-10 flex items-center gap-2"><Plus size={18} strokeWidth={3} /> {translations.add_new}</span>
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-40 gap-6">
                <div className="w-16 h-16 border-[6px] border-white/5 border-t-[#c9a84c] rounded-full animate-spin" />
                <p className="text-emerald-400/40 font-black text-[10px] uppercase tracking-[0.3em]">{translations.loading}</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {items.length === 0 ? (
                   <div className="text-center py-32 bg-white/5 rounded-[3rem] border-2 border-dashed border-white/10">
                      <div className="w-20 h-20 bg-white/5 rounded-3xl shadow-inner flex items-center justify-center mx-auto mb-6 text-white/20 border border-white/10">
                        <Map size={40} />
                      </div>
                      <p className="text-white/20 font-black uppercase tracking-[0.3em] text-[10px]">{translations.no_items}</p>
                   </div>
                ) : items.map((item: any) => (
                  <div key={item.id} className="group bg-white/5 border border-white/10 p-6 rounded-[2.5rem] flex flex-col sm:flex-row items-center justify-between hover:bg-white/[0.08] transition-all duration-500 gap-8 shadow-lg">
                    <div className="flex items-center gap-8 w-full sm:w-auto">
                      <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-3xl shadow-2xl bg-black/40 border border-white/10">
                        {item.image_url ? (
                          <img src={item.image_url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/10"><Map size={40} /></div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-bold text-white text-2xl leading-tight mb-3 font-playfair">{item[`name_${locale}`] || item.name_en}</h3>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                           <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20">{item.slug}</span>
                           <span className="text-xl font-black text-[#c9a84c] tracking-tight">${item.price_usd || item.price_per_night}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 w-full sm:w-auto">
                      <button className="flex-1 sm:flex-none w-14 h-14 rounded-2xl bg-white/5 text-white/40 hover:bg-[#c9a84c] hover:text-[#1a3d2b] transition-all duration-500 border border-white/10 flex items-center justify-center group/btn shadow-lg">
                        <Edit size={22} className="transition-transform group-hover/btn:scale-110" />
                      </button>
                      <button onClick={() => deleteItem(item.id)} className="flex-1 sm:flex-none w-14 h-14 rounded-2xl bg-white/5 text-white/40 hover:bg-red-500 hover:text-white transition-all duration-500 border border-white/10 flex items-center justify-center group/btn shadow-lg">
                        <Trash2 size={22} className="transition-transform group-hover/btn:scale-110" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

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
    <div className="bg-white">
      <div className="flex border-b border-gray-100 overflow-x-auto bg-gray-50/50 hide-scrollbar scroll-smooth">
        {[
          { id: "bookings", icon: Calendar, label: translations.tab_bookings },
          { id: "tours", icon: Map, label: translations.tab_tours },
          { id: "hotels", icon: Hotel, label: translations.tab_hotels },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-8 py-5 font-bold transition-all border-b-2 whitespace-nowrap text-sm ${
              activeTab === tab.id ? "border-[#c9a84c] text-[#1a3d2b] bg-white shadow-[0_-4px_0_inset_#c9a84c]" : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"
            }`}
          >
            <tab.icon size={18} className={activeTab === tab.id ? "text-[#c9a84c]" : ""} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6 md:p-10 min-h-[400px]">
        {activeTab === "bookings" ? (
          <AdminBookingTable initialBookings={initialBookings} translations={translations} />
        ) : (
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
              <h2 className="text-3xl font-playfair font-black text-[#1a3d2b]">{getActiveLabel()}</h2>
              <button className="btn-primary !py-3.5 !px-8 !text-[12px] w-full sm:w-auto shadow-lg shadow-[#1a3d2b]/20">
                <Plus size={18} className="mr-2" /> {translations.add_new}
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-[#c9a84c] rounded-full animate-spin" />
                <p className="text-gray-400 font-bold text-xs uppercase tracking-[0.2em]">{translations.loading}</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {items.length === 0 ? (
                   <div className="text-center py-24 bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-200">
                      <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <Map size={32} />
                      </div>
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">{translations.no_items}</p>
                   </div>
                ) : items.map((item: any) => (
                  <div key={item.id} className="group bg-white border border-gray-100 p-6 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between hover:shadow-2xl hover:shadow-black/[0.04] transition-all duration-500 gap-6">
                    <div className="flex items-center gap-6 w-full sm:w-auto">
                      <div className="relative w-20 h-20 shrink-0 overflow-hidden rounded-2xl shadow-inner bg-gray-50 border border-gray-100">
                        {item.image_url ? (
                          <img src={item.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#c9a84c]/30"><Map size={32} /></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-[#0d1117] text-xl leading-tight mb-2 font-playfair">{item[`name_${locale}`] || item.name_en}</h3>
                        <div className="flex items-center gap-4">
                           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">{item.slug}</span>
                           <span className="text-base font-black text-[#1a3d2b]">${item.price_usd || item.price_per_night}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto justify-end">
                      <button className="flex-1 sm:flex-none p-4 rounded-2xl bg-gray-50 text-gray-400 hover:bg-[#1a3d2b] hover:text-white transition-all duration-300 shadow-sm"><Edit size={20} /></button>
                      <button onClick={() => deleteItem(item.id)} className="flex-1 sm:flex-none p-4 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm"><Trash2 size={20} /></button>
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

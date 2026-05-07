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
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/${activeTab}?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchItems();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="bg-white">
      <div className="flex border-b border-gray-100 overflow-x-auto bg-gray-50/50 hide-scrollbar">
        {[
          { id: "bookings", icon: Calendar, label: translations.tab_bookings },
          { id: "tours", icon: Map, label: translations.tab_tours },
          { id: "hotels", icon: Hotel, label: translations.tab_hotels },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-8 py-5 font-bold transition-all border-b-2 whitespace-nowrap text-sm ${
              activeTab === tab.id ? "border-[#1a3d2b] text-[#1a3d2b] bg-white" : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100/50"
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6 md:p-10">
        {activeTab === "bookings" ? (
          <AdminBookingTable initialBookings={initialBookings} translations={translations} />
        ) : (
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h2 className="text-2xl font-playfair font-black text-[#1a3d2b] capitalize">{activeTab}</h2>
              <button className="btn-primary !py-3 !px-6 !text-[11px] w-full sm:w-auto">
                <Plus size={18} className="mr-2" /> Add New {activeTab.slice(0, -1)}
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-gray-100 border-t-[#1a3d2b] rounded-full animate-spin" />
                <p className="text-gray-400 font-bold text-sm uppercase tracking-widest">Loading {activeTab}...</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {items.length === 0 ? (
                   <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No {activeTab} found</p>
                   </div>
                ) : items.map((item: any) => (
                  <div key={item.id} className="group bg-white border border-gray-100 p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between hover:shadow-xl hover:shadow-black/[0.02] transition-all gap-4">
                    <div className="flex items-center gap-5 w-full sm:w-auto">
                      <div className="relative w-16 h-16 shrink-0 overflow-hidden rounded-2xl shadow-inner bg-gray-100">
                        {item.image_url ? (
                          <img src={item.image_url} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#c9a84c]"><Map /></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-[#0d1117] text-lg leading-tight mb-1">{item[`name_${locale}`] || item.name_en}</h3>
                        <div className="flex items-center gap-3">
                           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">{item.slug}</span>
                           <span className="text-sm font-bold text-[#1a3d2b]">${item.price_usd || item.price_per_night}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 w-full sm:w-auto justify-end">
                      <button className="flex-1 sm:flex-none p-3 rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all"><Edit size={20} /></button>
                      <button onClick={() => deleteItem(item.id)} className="flex-1 sm:flex-none p-3 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all"><Trash2 size={20} /></button>
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

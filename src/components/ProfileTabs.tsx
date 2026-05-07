"use client";
import { useState } from "react";
import { Calendar, Settings, Map, Hotel, Plane, Clock } from "lucide-react";
import ProfileSettings from "./ProfileSettings";

export default function ProfileTabs({ bookings, userData, translations, locale }: any) {
  const [activeTab, setActiveTab] = useState("bookings");

  return (
    <div>
      <div className="flex border-b border-gray-100 mb-8 overflow-x-auto">
        <button 
          onClick={() => setActiveTab("bookings")}
          className={`flex items-center gap-2 px-6 py-4 font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "bookings" ? "border-[#1a3d2b] text-[#1a3d2b]" : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          <Calendar size={18} />
          {translations.my_bookings}
        </button>
        <button 
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-6 py-4 font-bold transition-all border-b-2 whitespace-nowrap ${
            activeTab === "settings" ? "border-[#1a3d2b] text-[#1a3d2b]" : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          <Settings size={18} />
          {translations.settings}
        </button>
      </div>

      {activeTab === "bookings" ? (
        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              <p className="text-gray-500 mb-4">{translations.no_bookings}</p>
              <a href={`/${locale}#tours`} className="btn-primary inline-block">
                {translations.explore_tours}
              </a>
            </div>
          ) : (
            <div className="grid gap-6">
              {bookings.map((booking: any) => (
                <div key={booking.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[#f0f7f4] flex items-center justify-center text-[#1a3d2b]">
                      {booking.item_type === 'tour' && <Map size={24} />}
                      {booking.item_type === 'hotel' && <Hotel size={24} />}
                      {booking.item_type === 'transport' && <Plane size={24} />}
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#c9a84c] mb-1 block">
                        {translations[`type_${booking.item_type}`]}
                      </span>
                      <h3 className="text-lg font-bold text-[#0d1117]">
                        {booking.tour_name || booking.hotel_name || booking.transport_title}
                      </h3>
                      <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(booking.preferred_date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock size={14} /> {booking.guests} {translations.guests}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                      booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {translations[`status_${booking.status}`]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <ProfileSettings initialUser={userData} translations={translations} />
      )}
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { 
  LayoutDashboard, 
  Map, 
  Calendar, 
  Users, 
  TrendingUp, 
  Package, 
  CheckCircle,
  Clock
} from "lucide-react";

export default function AdminDashboard() {
  const t = useTranslations("admin"); // Need to add these to messages
  const [stats, setStats] = useState({
    totalBookings: 0,
    activeTours: 0,
    newMessages: 0,
    revenue: 0
  });

  useEffect(() => {
    // Fetch real stats later
    setStats({
      totalBookings: 124,
      activeTours: 12,
      newMessages: 8,
      revenue: 45800
    });
  }, []);

  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900 font-playfair">Dashboard</h1>
        <p className="text-gray-500">Welcome back, Admin. Here's what's happening today.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Bookings", value: stats.totalBookings, icon: Calendar, color: "bg-blue-500" },
          { label: "Active Tours", value: stats.activeTours, icon: Map, color: "bg-emerald-500" },
          { label: "New Messages", value: stats.newMessages, icon: Users, color: "bg-amber-500" },
          { label: "Est. Revenue", value: `$${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: "bg-purple-500" },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`${item.color} p-3 rounded-xl text-white`}>
              <item.icon size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-semibold">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
            <button className="text-sm text-emerald-600 font-semibold hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <Users size={18} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">John Doe</p>
                    <p className="text-xs text-gray-500">Kel-Suu Explorer • 2 guests</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">Confirmed</span>
                  <p className="text-xs text-gray-400 mt-1">2h ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Add New Tour", icon: Package, href: "/admin/tours/new" },
              { label: "Manage Photos", icon: Map, href: "/admin/media" },
              { label: "Check Messages", icon: Users, href: "/admin/messages" },
              { label: "Settings", icon: LayoutDashboard, href: "/admin/settings" },
            ].map((action, i) => (
              <button key={i} className="flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-50 hover:bg-emerald-50 transition-colors border border-transparent hover:border-emerald-100 text-gray-600 hover:text-emerald-700">
                <action.icon size={28} className="mb-2" />
                <span className="text-sm font-bold">{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

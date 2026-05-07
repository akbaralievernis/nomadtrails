"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Map, 
  Calendar, 
  Users, 
  Settings, 
  LogOut,
  Mountain,
  Home
} from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const locale = pathname.split('/')[1];

  const menuItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: `/${locale}/admin` },
    { label: "Manage Tours", icon: Map, href: `/${locale}/admin/tours` },
    { label: "Bookings", icon: Calendar, href: `/${locale}/admin/bookings` },
    { label: "Destinations", icon: Mountain, href: `/${locale}/admin/destinations` },
    { label: "Messages", icon: Users, href: `/${locale}/admin/messages` },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0d1117] text-white fixed h-full z-50">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Mountain className="text-[#c9a84c]" size={28} />
            <div>
              <div className="font-playfair font-bold text-lg leading-tight">NOMAD</div>
              <div className="text-[10px] tracking-[0.2em] text-[#c9a84c] font-bold">ADMIN PANEL</div>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? "bg-[#c9a84c] text-white font-bold" 
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
          >
            <Home size={20} />
            <span>View Website</span>
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}

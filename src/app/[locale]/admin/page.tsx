import { auth } from "@/auth";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Users, Calendar, Map, CheckCircle, XCircle, Clock } from "lucide-react";

import AdminTabs from "@/components/AdminTabs";

export default async function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();

  if (!session || (session.user as any).role !== 'admin') {
    redirect(`/${locale}`);
  }

  const t = await getTranslations("admin");

  // Fetch all bookings for admin
  const [bookings]: any = await pool.query(
    `SELECT b.*, t.name_${locale} as tour_name, h.name_${locale} as hotel_name, tr.title_${locale} as transport_title
     FROM bookings b
     LEFT JOIN tours t ON b.tour_id = t.id
     LEFT JOIN hotels h ON b.hotel_id = h.id
     LEFT JOIN transport_options tr ON b.transport_id = tr.id
     ORDER BY b.created_at DESC`
  );

  const stats = {
    total: bookings.length,
    new: bookings.filter((b: any) => b.status === 'new').length,
    confirmed: bookings.filter((b: any) => b.status === 'confirmed').length,
  };

  const translations = {
    tab_bookings: t("tab_bookings"),
    tab_tours: t("tab_tours"),
    tab_hotels: t("tab_hotels"),
    table_id: t("table_id"),
    table_client: t("table_client"),
    table_item: t("table_item"),
    table_date: t("table_date"),
    table_status: t("table_status"),
    table_actions: t("table_actions"),
    guests: t("guests"),
    action_confirm: t("action_confirm"),
    action_cancel: t("action_cancel"),
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 bg-[#f4f7f6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 px-4 md:px-0">
            <h1 className="text-3xl font-bold font-playfair text-[#1a3d2b] flex items-center gap-3">
              <ShieldCheck className="text-[#c9a84c]" size={36} />
              {t("dashboard_title")}
            </h1>
            <div className="flex flex-wrap gap-4">
              {[
                { label: t("total_bookings"), value: stats.total, icon: Calendar, color: "blue" },
                { label: t("new_bookings"), value: stats.new, icon: Clock, color: "orange" },
                { label: t("confirmed_bookings"), value: stats.confirmed, icon: CheckCircle, color: "green" },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 min-w-[150px]">
                  <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600`}>
                    <stat.icon size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">{stat.label}</p>
                    <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            <AdminTabs initialBookings={bookings} translations={translations} locale={locale} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

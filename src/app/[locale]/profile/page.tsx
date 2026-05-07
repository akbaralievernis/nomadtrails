export const dynamic = 'force-dynamic';
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import pool from "@/lib/db";
import { getTranslations } from "next-intl/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, MapPin, CreditCard, Clock, Plane, Hotel, Map, Settings, User } from "lucide-react";
import ProfileTabs from "@/components/ProfileTabs"; // I'll create this next

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await auth();
  const t = await getTranslations("profile");

  if (!session || !session.user) {
    redirect(`/${locale}`);
  }

  // Fetch full user data
  const [userRows]: any = await pool.query(
    "SELECT * FROM users WHERE email = ?",
    [session.user.email]
  );
  const userData = userRows[0];

  // Fetch bookings
  const [bookings]: any = await pool.query(
    `SELECT b.*, t.name_${locale} as tour_name, h.name_${locale} as hotel_name, tr.title_${locale} as transport_title
     FROM bookings b
     LEFT JOIN tours t ON b.tour_id = t.id
     LEFT JOIN hotels h ON b.hotel_id = h.id
     LEFT JOIN transport_options tr ON b.transport_id = tr.id
     WHERE b.user_id = ?
     ORDER BY b.created_at DESC`,
    [userData.id]
  );

  const translations = {
    my_bookings: t("my_bookings"),
    settings: t("settings"),
    no_bookings: t("no_bookings"),
    explore_tours: t("explore_tours"),
    type_tour: t("type_tour"),
    type_hotel: t("type_hotel"),
    type_transport: t("type_transport"),
    status_new: t("status_new"),
    status_contacted: t("status_contacted"),
    status_confirmed: t("status_confirmed"),
    status_cancelled: t("status_cancelled"),
    guests: t("guests"),
    full_name: t("full_name"),
    phone_number: t("phone_number"),
    save_changes: t("save_changes"),
    saved: t("saved"),
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 bg-[#f8f9fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 mb-8">
            <div className="bg-gradient-to-r from-[#1a3d2b] to-[#2d5a42] px-8 py-12 text-white">
              <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                {session.user.image ? (
                  <img src={session.user.image} alt={session.user.name || ""} className="w-24 h-24 rounded-full border-4 border-white/20 shadow-lg" />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold border-4 border-white/20">
                    {session.user.name?.[0]}
                  </div>
                )}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold font-playfair">{userData.name}</h1>
                  <p className="text-white/70">{session.user.email}</p>
                  {userData.role === 'admin' && (
                    <span className="inline-block mt-2 px-3 py-1 bg-[#c9a84c] text-[#1a3d2b] text-[10px] font-bold uppercase tracking-wider rounded-full">
                      Admin Access
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4 md:p-8">
               <ProfileTabs 
                 bookings={bookings} 
                 userData={userData} 
                 translations={translations} 
                 locale={locale}
               />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

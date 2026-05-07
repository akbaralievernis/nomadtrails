"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewTourPage() {
  const router = useRouter();
  const { locale } = useParams();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    slug: "",
    duration_days: 7,
    price_usd: 1200,
    difficulty: "Moderate",
    group_min: 2,
    group_max: 10,
    image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4",
    name_en: "",
    name_ru: "",
    name_ky: "",
    desc_en: "",
    desc_ru: "",
    desc_ky: "",
    includes_en: ["Guide", "Transport", "Meals"]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/tours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        router.push(`/${locale}/admin/tours`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <Link href={`/${locale}/admin/tours`} className="flex items-center gap-2 text-gray-500 hover:text-emerald-700 transition-colors font-bold">
          <ArrowLeft size={20} />
          Back to Tours
        </Link>
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-700 transition-all shadow-lg disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          <span>Save Tour</span>
        </button>
      </div>

      <form className="space-y-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 font-playfair border-b border-gray-100 pb-4">Basic Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Tour Slug (unique URL)</label>
            <input 
              type="text" 
              placeholder="e.g. kelsuu-explorer"
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 outline-none"
              value={formData.slug}
              onChange={e => setFormData({...formData, slug: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Thumbnail Image URL</label>
            <input 
              type="text" 
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 outline-none"
              value={formData.image_url}
              onChange={e => setFormData({...formData, image_url: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Duration (Days)</label>
            <input 
              type="number" 
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 outline-none"
              value={formData.duration_days}
              onChange={e => setFormData({...formData, duration_days: parseInt(e.target.value)})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Price (USD)</label>
            <input 
              type="number" 
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500/20 outline-none"
              value={formData.price_usd}
              onChange={e => setFormData({...formData, price_usd: parseInt(e.target.value)})}
            />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 font-playfair border-b border-gray-100 pb-4 pt-8">Localized Content</h2>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Name (EN)</label>
              <input type="text" className="w-full p-3 rounded-xl border border-gray-200" value={formData.name_en} onChange={e => setFormData({...formData, name_en: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Name (RU)</label>
              <input type="text" className="w-full p-3 rounded-xl border border-gray-200" value={formData.name_ru} onChange={e => setFormData({...formData, name_ru: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Name (KY)</label>
              <input type="text" className="w-full p-3 rounded-xl border border-gray-200" value={formData.name_ky} onChange={e => setFormData({...formData, name_ky: e.target.value})} />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description (EN)</label>
              <textarea className="w-full p-3 rounded-xl border border-gray-200 h-24" value={formData.desc_en} onChange={e => setFormData({...formData, desc_en: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description (RU)</label>
              <textarea className="w-full p-3 rounded-xl border border-gray-200 h-24" value={formData.desc_ru} onChange={e => setFormData({...formData, desc_ru: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description (KY)</label>
              <textarea className="w-full p-3 rounded-xl border border-gray-200 h-24" value={formData.desc_ky} onChange={e => setFormData({...formData, desc_ky: e.target.value})} />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

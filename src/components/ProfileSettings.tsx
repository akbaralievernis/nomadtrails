"use client";
import { useState } from "react";
import { User, Settings, Save, Check, Phone } from "lucide-react";

export default function ProfileSettings({ initialUser, translations }: { initialUser: any, translations: any }) {
  const [name, setName] = useState(initialUser.name || "");
  const [phone, setPhone] = useState(initialUser.phone || "");
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">{translations.full_name}</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#1a3d2b] focus:ring-2 focus:ring-[#1a3d2b]/10 outline-none transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">{translations.phone_number}</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="tel" 
              value={phone} 
              onChange={e => setPhone(e.target.value)}
              placeholder="+996 ..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#1a3d2b] focus:ring-2 focus:ring-[#1a3d2b]/10 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          type="submit" 
          disabled={loading}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${
            saved ? 'bg-green-600 text-white' : 'bg-[#1a3d2b] text-white hover:bg-[#2d5a42]'
          }`}
        >
          {loading ? '...' : saved ? <><Check size={18} /> {translations.saved}</> : <><Save size={18} /> {translations.save_changes}</>}
        </button>
      </div>
    </form>
  );
}

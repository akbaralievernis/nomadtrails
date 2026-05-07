"use client";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Mountain, Camera, Share2, Play, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const t = useTranslations("footer");
  const tn = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";

  const links = [
    { label: tn("home"), href: `/${locale}` },
    { label: tn("destinations"), href: "#destinations" },
    { label: tn("tours"), href: "#tours" },
    { label: tn("hotels"), href: "#hotels" },
    { label: tn("transport"), href: "#transport" },
    { label: tn("contact"), href: "#contact" },
  ];

  return (
    <footer style={{ background: "#0d1117", color: "rgba(255,255,255,0.75)", padding: "5rem 2rem 2rem" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] gap-10 lg:gap-16 mb-16">
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
                 <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 10L65 30H35L50 10Z" fill="#c9a84c"/>
                    <circle cx="50" cy="55" r="25" stroke="#c9a84c" strokeWidth="2"/>
                    <path d="M30 55C30 55 40 45 50 45C60 45 70 55 70 55" stroke="#c9a84c" strokeWidth="3"/>
                    <path d="M35 75L50 55L65 75" stroke="#1a3d2b" strokeWidth="4" strokeLinecap="round"/>
                 </svg>
              </div>
              <div>
                <div style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: "1.25rem", color: "#fff", letterSpacing: "0.02em", lineHeight: 1 }}>{tc("site_name")}</div>
                <div style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a84c", fontWeight: 700 }}>{tc("site_tagline")}</div>
              </div>
            </div>
            <p style={{ fontSize: "0.9rem", lineHeight: 1.75, maxWidth: 320, marginBottom: "1.75rem", color: "rgba(255,255,255,0.55)" }}>{t("tagline")}</p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              {[Camera, Share2, Play].map((Icon, i) => (
                <a key={i} href="#" style={{ width: 38, height: 38, borderRadius: "50%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", textDecoration: "none" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#c9a84c"; (e.currentTarget as HTMLElement).style.borderColor = "#c9a84c"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)"; }}>
                  <Icon size={15} color="#fff" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.5rem" }}>{t("quick_links")}</h4>
            <ul style={{ listStyle: "none" }}>
              {links.map(l => (
                <li key={l.label} style={{ marginBottom: "0.75rem" }}>
                  <a href={l.href} style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none", fontSize: "0.88rem", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#c9a84c")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.5rem" }}>{t("contact")}</h4>
            {[
              { icon: Phone, text: "+996 700 123 456" },
              { icon: Mail, text: "info@nomadtrails.kg" },
              { icon: MapPin, text: "Bishkek, Kyrgyzstan" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "1rem" }}>
                <Icon size={14} color="#c9a84c" />
                <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)" }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.35)" }}>
            © {new Date().getFullYear()} {tc("site_name")}. {t("rights")}
          </span>
          <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.25)" }}>
            {t("built_with")}
          </span>
        </div>
      </div>
    </footer>
  );
}

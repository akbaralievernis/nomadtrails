"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Globe, ChevronDown, Mountain } from "lucide-react";

const LOCALES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "ky", label: "Кыргызча", flag: "🇰🇬" },
];

export default function Navbar() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const currentLocale = pathname.split("/")[1] || "en";
  const currentLang = LOCALES.find((l) => l.code === currentLocale) || LOCALES[0];

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  function switchLocale(code: string) {
    const segments = pathname.split("/");
    segments[1] = code;
    router.push(segments.join("/") || "/");
    setLangOpen(false);
  }

  const navLinks = [
    { href: "#destinations", label: t("destinations") },
    { href: "#tours", label: t("tours") },
    { href: "#hotels", label: t("hotels") },
    { href: "#transport", label: t("transport") },
    { href: "#contact", label: t("contact") },
  ];

  return (
    <header
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        transition: "all 0.4s ease",
        background: scrolled ? "rgba(255,255,255,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        boxShadow: scrolled ? "0 2px 30px rgba(0,0,0,0.08)" : "none",
        padding: scrolled ? "1rem 0" : "1.5rem 0",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(1.25rem, 5vw, 2.5rem)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Logo */}
        <Link href={`/${currentLocale}`} style={{ display: "flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}>
          <div style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center" }}>
             <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 10L65 30H35L50 10Z" fill="#c9a84c"/>
                <circle cx="50" cy="55" r="25" stroke="#c9a84c" strokeWidth="2"/>
                <path d="M30 55C30 55 40 45 50 45C60 45 70 55 70 55" stroke="#c9a84c" strokeWidth="3"/>
                <path d="M35 75L50 55L65 75" stroke="#1a3d2b" strokeWidth="4" strokeLinecap="round"/>
             </svg>
          </div>
          <div>
            <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 800, fontSize: "1.2rem", color: scrolled ? "#0d1117" : "#fff", display: "block", lineHeight: 1, letterSpacing: "0.02em" }}>{tc("site_name")}</span>
            <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: scrolled ? "#40916c" : "#c9a84c", fontWeight: 700 }}>{tc("site_tagline")}</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: "2rem" }} className="hidden-mobile">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} style={{ textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, letterSpacing: "0.03em", color: scrolled ? "#343a40" : "rgba(255,255,255,0.9)", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = scrolled ? "#1a3d2b" : "#c9a84c")}
              onMouseLeave={e => (e.currentTarget.style.color = scrolled ? "#343a40" : "rgba(255,255,255,0.9)")}>
              {link.label}
            </a>
          ))}

          {/* Language Switcher */}
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <Link href={`/${currentLocale}/admin`} style={{ fontSize: "0.7rem", fontWeight: 800, color: scrolled ? "#1a3d2b" : "#c9a84c", textTransform: "uppercase", letterSpacing: "0.15em", textDecoration: "none", border: `1px solid ${scrolled ? "rgba(26,61,43,0.2)" : "rgba(201,168,76,0.4)"}`, padding: "0.4rem 0.8rem", borderRadius: "8px" }}>Admin</Link>
            <div style={{ position: "relative" }}>
              <button onClick={() => setLangOpen(!langOpen)} style={{ display: "flex", alignItems: "center", gap: "0.4rem", background: scrolled ? "rgba(26,61,43,0.08)" : "rgba(255,255,255,0.15)", border: "none", borderRadius: 999, padding: "0.5rem 1rem", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600, color: scrolled ? "#1a3d2b" : "#fff", transition: "all 0.2s" }}>
                <Globe size={14} />
                <span>{currentLang.flag} {currentLang.code.toUpperCase()}</span>
                <ChevronDown size={12} style={{ transform: langOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </button>
            {langOpen && (
              <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#fff", borderRadius: 12, boxShadow: "0 8px 40px rgba(0,0,0,0.15)", overflow: "hidden", minWidth: 150, border: "1px solid rgba(0,0,0,0.06)" }}>
                {LOCALES.map((l) => (
                  <button key={l.code} onClick={() => switchLocale(l.code)} style={{ display: "flex", alignItems: "center", gap: "0.6rem", width: "100%", padding: "0.75rem 1rem", border: "none", background: l.code === currentLocale ? "rgba(26,61,43,0.06)" : "transparent", cursor: "pointer", fontSize: "0.88rem", fontWeight: l.code === currentLocale ? 700 : 400, color: "#0d1117", transition: "background 0.15s" }}>
                    <span>{l.flag}</span><span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

          <a href="#tours" className="btn-primary" style={{ padding: "0.6rem 1.4rem", fontSize: "0.82rem" }}>
            {t("tours")}
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ display: "none", background: "none", border: "none", cursor: "pointer", color: scrolled ? "#0d1117" : "#fff" }} className="mobile-menu-btn">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div style={{ position: "fixed", inset: 0, top: scrolled ? 64 : 88, background: "rgba(255,255,255,0.98)", backdropFilter: "blur(20px)", padding: "2rem", display: "flex", flexDirection: "column", gap: "1.25rem", zIndex: 999, overflowY: "auto" }}>
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMenuOpen(false)} style={{ textDecoration: "none", fontSize: "1.25rem", fontFamily: "'Playfair Display',serif", fontWeight: 700, color: "#1a3d2b", borderBottom: "1px solid rgba(0,0,0,0.05)", paddingBottom: "1rem" }}>
              {link.label}
            </a>
          ))}
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginTop: "1rem" }}>
            {LOCALES.map((l) => (
              <button key={l.code} onClick={() => { switchLocale(l.code); setMenuOpen(false); }} style={{ padding: "0.5rem 1rem", borderRadius: 999, border: `1.5px solid ${l.code === currentLocale ? "#1a3d2b" : "#e9ecef"}`, background: l.code === currentLocale ? "#1a3d2b" : "transparent", color: l.code === currentLocale ? "#fff" : "#343a40", cursor: "pointer", fontWeight: 600, fontSize: "0.8rem" }}>
                {l.flag} {l.label}
              </button>
            ))}
          </div>
          <a href="#tours" onClick={() => setMenuOpen(false)} className="btn-primary" style={{ marginTop: "1.5rem", justifyContent: "center", padding: "1rem" }}>
            {t("tours")}
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .mobile-menu-btn { display: block !important; padding: 0.5rem; margin-right: -0.5rem; }
        }
        .mobile-scroll-container::-webkit-scrollbar { display: none; }
      `}</style>
    </header>
  );
}

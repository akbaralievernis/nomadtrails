"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, MapPin } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const DESTINATIONS = [
  { id: 1, key: "kelsuu", category: "lakes", image: "/images/dest_kelsuu.png" },
  { id: 2, key: "skazka", category: "canyons", image: "/images/dest_skazka.png" },
  { id: 3, key: "tashrabat", category: "history", image: "/images/dest_tashrabat.png" },
  { id: 4, key: "enilchek", category: "mountains", image: "/images/dest_enilchek.png" },
  { id: 5, key: "saryjaz", category: "mountains", image: "/images/dest_saryjaz.png" },
  { id: 6, key: "sonkul", category: "lakes", image: "/images/dest_sonkul.png" },
];

const FILTERS = ["filter_all", "filter_mountains", "filter_lakes", "filter_history", "filter_canyons"];
const FILTER_VALUES = ["all", "mountains", "lakes", "history", "canyons"];

export default function FeaturedDestinations() {
  const t = useTranslations("destinations");
  const [active, setActive] = useState("all");
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = active === "all" ? DESTINATIONS : DESTINATIONS.filter(d => d.category === active);

  useEffect(() => {
    gsap.fromTo(headRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.9, scrollTrigger: { trigger: headRef.current, start: "top 85%" } });
  }, []);

  useEffect(() => {
    if (gridRef.current) {
      gsap.fromTo(gridRef.current.children, { opacity: 0, scale: 0.92, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" });
    }
  }, [active]);

  return (
    <section ref={sectionRef} id="destinations" className="section-padding" style={{ background: "#fff" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div ref={headRef} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem", marginBottom: "3rem" }}>
          <div style={{ flex: "1 1 300px" }}>
            <span className="section-badge">{t("title")}</span>
            <h2 className="section-title">{t("title")}</h2>
            <p className="section-subtitle" style={{ marginTop: "0.75rem" }}>{t("subtitle")}</p>
          </div>

          {/* Filter Pills */}
          <div className="mobile-scroll-container" style={{ display: "flex", gap: "0.6rem", overflowX: "auto", paddingBottom: "0.5rem", scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {FILTERS.map((f, i) => (
              <button key={f} onClick={() => setActive(FILTER_VALUES[i])} style={{ padding: "0.6rem 1.4rem", borderRadius: 999, border: "none", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600, transition: "all 0.25s", background: active === FILTER_VALUES[i] ? "#1a3d2b" : "#f0f0f0", color: active === FILTER_VALUES[i] ? "#fff" : "#6c757d", whiteSpace: "nowrap" }}>
                {t(f as "filter_all" | "filter_mountains" | "filter_lakes" | "filter_history" | "filter_canyons")}
              </button>
            ))}
          </div>
        </div>

        <div ref={gridRef} className="responsive-grid">
          {filtered.map((dest) => (
            <article key={dest.id} className="card-hover" style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 30px rgba(0,0,0,0.07)", border: "1px solid rgba(0,0,0,0.04)", background: "#fff" }}>
              <div style={{ position: "relative", height: 220, overflow: "hidden" }}>
                <img src={dest.image} alt={t(`list.${dest.key}.name`)} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s ease" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                <div style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(255,255,255,0.9)", backdropFilter: "blur(8px)", borderRadius: 999, padding: "0.3rem 0.75rem", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#1a3d2b" }}>
                  {t(`filter_${dest.category}` as any)}
                </div>
              </div>
              <div className="card-content" style={{ padding: "clamp(1.25rem, 4vw, 2rem)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#6c757d", fontSize: "0.8rem", marginBottom: "0.5rem" }}>
                  <MapPin size={12} /><span>{t(`list.${dest.key}.region`)}</span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.3rem", fontWeight: 700, color: "#0d1117", marginBottom: "0.5rem" }}>{t(`list.${dest.key}.name`)}</h3>
                <p style={{ fontSize: "0.88rem", color: "#6c757d", lineHeight: 1.65, marginBottom: "1.25rem" }}>{t(`list.${dest.key}.desc`)}</p>
                <a href="#tours" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", color: "#1a3d2b", fontWeight: 700, fontSize: "0.85rem", textDecoration: "none", transition: "gap 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.gap = "0.75rem")}
                  onMouseLeave={e => (e.currentTarget.style.gap = "0.4rem")}>
                  {t("read_more")} <ArrowRight size={14} />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

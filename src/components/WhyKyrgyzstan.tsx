"use client";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Leaf, Users, Map, Zap } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ITEMS = [
  { key: "item1", icon: Leaf, color: "#40916c" },
  { key: "item2", icon: Users, color: "#c9a84c" },
  { key: "item3", icon: Map, color: "#1a3d2b" },
  { key: "item4", icon: Zap, color: "#c9a84c" },
];

export default function WhyKyrgyzstan() {
  const t = useTranslations("why");
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(headRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.9, scrollTrigger: { trigger: headRef.current, start: "top 85%" } });
    if (cardsRef.current) {
      gsap.fromTo(cardsRef.current.children, { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: cardsRef.current, start: "top 80%" } });
    }
  }, []);

  return (
    <section ref={sectionRef} id="why" className="section-padding" style={{ background: "#f8f9fa" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div ref={headRef} style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span className="section-badge">{t("title")}</span>
          <h2 className="section-title" style={{ marginBottom: "1rem" }}>{t("title")}</h2>
          <p className="section-subtitle" style={{ margin: "0 auto", textAlign: "center" }}>{t("subtitle")}</p>
        </div>

        <div ref={cardsRef} className="responsive-grid">
          {ITEMS.map(({ key, icon: Icon, color }) => (
            <div key={key} className="card-hover" style={{ background: "#fff", borderRadius: 20, padding: "clamp(1.5rem, 5vw, 2.5rem) clamp(1.25rem, 4vw, 2rem)", boxShadow: "0 4px 24px rgba(0,0,0,0.05)", border: "1px solid rgba(0,0,0,0.04)", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: `${color}10` }} />
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}>
                <Icon size={24} color={color} />
              </div>
              <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.25rem", fontWeight: 700, color: "#0d1117", marginBottom: "0.75rem" }}>
                {t(`${key}_title` as "item1_title" | "item2_title" | "item3_title" | "item4_title")}
              </h3>
              <p style={{ fontSize: "0.92rem", color: "#6c757d", lineHeight: 1.7 }}>
                {t(`${key}_desc` as "item1_desc" | "item2_desc" | "item3_desc" | "item4_desc")}
              </p>
              <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 3, background: `linear-gradient(90deg, ${color}, transparent)` }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

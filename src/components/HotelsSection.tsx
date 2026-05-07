"use client";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, MapPin, Wifi, Coffee, Car } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const HOTELS = [
  { id: 1, key: "kelsuu", type: "type_yurt", price: 85, rating: 4.9, reviews: 64, image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80", amenities: ["wifi", "meals", "transfer"] },
  { id: 2, key: "khan_tengri", type: "type_lodge", price: 145, rating: 4.8, reviews: 41, image: "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?w=600&q=80", amenities: ["wifi", "spa", "transfer"] },
  { id: 3, key: "boutique", type: "type_hotel", price: 220, rating: 5.0, reviews: 28, image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80", amenities: ["wifi", "pool", "meals", "transfer"] },
  { id: 4, key: "guesthouse", type: "type_guesthouse", price: 55, rating: 4.7, reviews: 83, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80", amenities: ["meals", "transfer"] },
  { id: 5, key: "sky_camp", type: "type_yurt", price: 95, rating: 4.9, reviews: 52, image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=600&q=80", amenities: ["meals", "horse_riding", "transfer"] },
  { id: 6, key: "luxe", type: "type_hotel", price: 180, rating: 4.8, reviews: 107, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80", amenities: ["wifi", "pool", "spa", "meals"] },
];

const TYPE_COLOR: Record<string, string> = { type_yurt: "#40916c", type_lodge: "#1a3d2b", type_hotel: "#c9a84c", type_guesthouse: "#6c757d" };

export default function HotelsSection() {
  const t = useTranslations("hotels");
  const headRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(headRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.9, scrollTrigger: { trigger: headRef.current, start: "top 85%" } });
    if (gridRef.current) {
      gsap.fromTo(gridRef.current.children, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: gridRef.current, start: "top 80%" } });
    }
  }, []);

  return (
    <section id="hotels" className="section-padding" style={{ background: "#fff" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div ref={headRef} style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span className="section-badge">{t("title")}</span>
          <h2 className="section-title">{t("title")}</h2>
          <p className="section-subtitle" style={{ margin: "0.75rem auto 0" }}>{t("subtitle")}</p>
        </div>

        <div ref={gridRef} className="responsive-grid">
          {HOTELS.map((hotel) => (
            <article key={hotel.id} className="card-hover" style={{ borderRadius: 20, overflow: "hidden", background: "#fff", boxShadow: "0 4px 30px rgba(0,0,0,0.07)", border: "1px solid rgba(0,0,0,0.04)" }}>
              <div style={{ position: "relative", height: 210, overflow: "hidden" }}>
                <img src={hotel.image} alt={t(`list.${hotel.key}.name`)} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s" }}
                  onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
                  onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                <div style={{ position: "absolute", top: "1rem", left: "1rem", background: TYPE_COLOR[hotel.type] || "#1a3d2b", color: "#fff", borderRadius: 999, padding: "0.3rem 0.85rem", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                  {t(hotel.type as "type_yurt" | "type_lodge" | "type_hotel" | "type_guesthouse")}
                </div>
              </div>
              <div className="card-content" style={{ padding: "clamp(1.25rem, 4vw, 1.75rem)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.15rem", fontWeight: 700, color: "#0d1117" }}>{t(`list.${hotel.key}.name`)}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0 }}>
                    <Star size={12} color="#c9a84c" fill="#c9a84c" />
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0d1117" }}>{hotel.rating}</span>
                    <span style={{ fontSize: "0.75rem", color: "#6c757d" }}>({hotel.reviews})</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#6c757d", fontSize: "0.8rem", marginBottom: "1rem" }}>
                  <MapPin size={12} /><span>{t(`list.${hotel.key}.location`)}</span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
                  {hotel.amenities.slice(0, 3).map(a => (
                    <span key={a} style={{ background: "#f0f0f0", color: "#343a40", borderRadius: 8, padding: "0.2rem 0.6rem", fontSize: "0.72rem", fontWeight: 500 }}>{t(`amenities.${a}` as any)}</span>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.5rem", fontWeight: 700, color: "#1a3d2b" }}>${hotel.price}</span>
                    <span style={{ fontSize: "0.78rem", color: "#6c757d" }}> / {t("per_night")}</span>
                  </div>
                  <a href="#booking-form" className="btn-primary" style={{ padding: "0.6rem 1.3rem", fontSize: "0.82rem" }}>{t("book")}</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

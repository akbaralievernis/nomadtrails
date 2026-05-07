"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Clock, Users, Star, Check, X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const TOURS = [
  { id: 1, key: "kelsuu_tashrabat", days: 7, price: 890, group: "2-8", rating: 4.9, reviews: 47, image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80" },
  { id: 2, key: "enilchek", days: 12, price: 2400, group: "2-6", rating: 5.0, reviews: 18, image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=700&q=80" },
  { id: 3, key: "issyk_kul", days: 5, price: 550, group: "2-12", rating: 4.8, reviews: 92, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=700&q=80" },
  { id: 4, key: "nomadic", days: 9, price: 1250, group: "2-8", rating: 4.9, reviews: 33, image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=700&q=80" },
];

const DIFF_COLOR: Record<string, string> = { Easy: "#40916c", Moderate: "#c9a84c", Hard: "#c0392b", "Орто": "#c9a84c", "Средняя": "#c9a84c", "Жеңил": "#40916c", "Легкая": "#40916c", "Кыйын": "#c0392b", "Тяжелая": "#c0392b" };

export default function ToursSection() {
  const t = useTranslations("tours");
  const sectionRef = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", tour: "", date: "", guests: "2", message: "" });

  useEffect(() => {
    gsap.fromTo(headRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.9, scrollTrigger: { trigger: headRef.current, start: "top 85%" } });
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  }

  return (
    <section ref={sectionRef} id="tours" className="section-padding" style={{ background: "#f8f9fa" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div ref={headRef} style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span className="section-badge">{t("title")}</span>
          <h2 className="section-title">{t("title")}</h2>
          <p className="section-subtitle" style={{ margin: "0.75rem auto 0" }}>{t("subtitle")}</p>
        </div>

        {/* Tour Cards */}
        <div className="responsive-grid" style={{ marginBottom: "6rem" }}>
          {TOURS.map((tour) => {
            const tourDiff = t(`list.${tour.key}.difficulty`);
            return (
              <article key={tour.id} className="card-hover" style={{ display: "flex", flexDirection: "column", background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 30px rgba(0,0,0,0.07)", border: "1px solid rgba(0,0,0,0.04)" }}>
                <div style={{ position: "relative", height: 240, overflow: "hidden" }}>
                  <img src={tour.image} alt={t(`list.${tour.key}.name`)} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.6s" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.08)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")} />
                  <div style={{ position: "absolute", top: "1rem", left: "1rem", background: DIFF_COLOR[tourDiff] || "#1a3d2b", color: "#fff", borderRadius: 999, padding: "0.3rem 0.85rem", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    {tourDiff}
                  </div>
                  <div style={{ position: "absolute", bottom: "1rem", right: "1rem", background: "rgba(13,17,23,0.75)", backdropFilter: "blur(8px)", borderRadius: 12, padding: "0.5rem 0.85rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <Star size={12} color="#c9a84c" fill="#c9a84c" />
                    <span style={{ color: "#fff", fontSize: "0.82rem", fontWeight: 700 }}>{tour.rating}</span>
                    <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.75rem" }}>({tour.reviews})</span>
                  </div>
                </div>
                <div className="card-content" style={{ padding: "clamp(1.25rem, 4vw, 1.75rem)", flex: 1, display: "flex", flexDirection: "column" }}>
                  <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.3rem", fontWeight: 700, color: "#0d1117", marginBottom: "0.75rem" }}>{t(`list.${tour.key}.name`)}</h3>
                  <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#6c757d", fontSize: "0.82rem" }}>
                      <Clock size={13} /><span>{tour.days} {t("days")}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#6c757d", fontSize: "0.82rem" }}>
                      <Users size={13} /><span>{tour.group}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "1.5rem" }}>
                    {(t.raw(`list.${tour.key}.includes`) as string[]).map((inc) => (
                      <span key={inc} style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", background: "rgba(64,145,108,0.1)", color: "#1a3d2b", borderRadius: 999, padding: "0.25rem 0.7rem", fontSize: "0.75rem", fontWeight: 600 }}>
                        <Check size={10} />{inc}
                      </span>
                    ))}
                  </div>
                  <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <span style={{ fontSize: "0.8rem", color: "#6c757d" }}>{t("from")} </span>
                      <span style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.6rem", fontWeight: 700, color: "#1a3d2b" }}>${tour.price}</span>
                    </div>
                    <a href="#booking-form" className="btn-primary" style={{ padding: "0.65rem 1.5rem", fontSize: "0.85rem" }}>{t("book_now")}</a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Booking Form */}
        <div id="booking-form" style={{ background: "#fff", borderRadius: 24, padding: "clamp(1.5rem, 8vw, 3.5rem)", boxShadow: "0 8px 50px rgba(0,0,0,0.08)", border: "1px solid rgba(0,0,0,0.05)", maxWidth: 780, margin: "0 auto" }}>
          <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.8rem", fontWeight: 700, color: "#0d1117", marginBottom: "0.5rem", textAlign: "center" }}>{t("form_title")}</h3>
          <div style={{ width: 50, height: 3, background: "linear-gradient(90deg,#1a3d2b,#c9a84c)", borderRadius: 2, margin: "0 auto 2rem" }} />

          {submitted ? (
            <div style={{ textAlign: "center", padding: "3rem", color: "#40916c" }}>
              <Check size={48} style={{ margin: "0 auto 1rem" }} />
              <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>{t("form_success")}</p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
              {[
                { key: "name", label: t("form_name"), type: "text", span: 1 },
                { key: "email", label: t("form_email"), type: "email", span: 1 },
                { key: "phone", label: t("form_phone"), type: "tel", span: 1 },
                { key: "date", label: t("form_date"), type: "date", span: 1 },
              ].map(({ key, label, type, span }) => (
                <div key={key} style={{ gridColumn: span === 2 ? "1 / -1" : undefined }}>
                  <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#343a40", marginBottom: "0.4rem" }}>{label}</label>
                  <input type={type} className="input-field" required value={formData[key as keyof typeof formData]} onChange={e => setFormData(p => ({ ...p, [key]: e.target.value }))} />
                </div>
              ))}
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#343a40", marginBottom: "0.4rem" }}>{t("form_tour")}</label>
                <select className="input-field" value={formData.tour} onChange={e => setFormData(p => ({ ...p, tour: e.target.value }))}>
                  <option value="">—</option>
                  {TOURS.map(t2 => <option key={t2.id} value={t(`list.${t2.key}.name`)}>{t(`list.${t2.key}.name`)}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#343a40", marginBottom: "0.4rem" }}>{t("form_guests")}</label>
                <input type="number" min={1} max={20} className="input-field" value={formData.guests} onChange={e => setFormData(p => ({ ...p, guests: e.target.value }))} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, color: "#343a40", marginBottom: "0.4rem" }}>{t("form_message")}</label>
                <textarea className="input-field" rows={3} value={formData.message} onChange={e => setFormData(p => ({ ...p, message: e.target.value }))} style={{ resize: "vertical" }} />
              </div>
              <div style={{ gridColumn: "1 / -1", textAlign: "center" }}>
                <button type="submit" className="btn-primary" style={{ padding: "1rem 3rem", fontSize: "0.95rem" }}>{t("form_submit")}</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

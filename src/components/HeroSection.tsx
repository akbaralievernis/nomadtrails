"use client";
import { useTranslations } from "next-intl";
import PerspectiveSlider from "./PerspectiveSlider";
import { ChevronDown } from "lucide-react";

export default function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section id="home" style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <PerspectiveSlider />

      {/* Scroll hint */}
      <div 
        style={{ 
          position: "absolute", 
          bottom: "2rem", 
          left: "50%", 
          transform: "translateX(-50%)", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          gap: "0.5rem", 
          color: "rgba(255,255,255,0.7)", 
          fontSize: "0.75rem", 
          letterSpacing: "0.15em", 
          textTransform: "uppercase", 
          zIndex: 30,
          pointerEvents: "none"
        }}
      >
        <span>{t("scroll")}</span>
        <ChevronDown size={18} className="animate-bounce" />
      </div>
    </section>
  );
}

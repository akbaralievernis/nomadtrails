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
          bottom: "2.5rem", 
          left: "50%", 
          transform: "translateX(-50%)", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          gap: "0.5rem", 
          color: "white", 
          textShadow: "0 2px 10px rgba(0,0,0,0.5)",
          fontSize: "0.75rem", 
          fontWeight: "bold",
          letterSpacing: "0.2em", 
          textTransform: "uppercase", 
          zIndex: 50,
          pointerEvents: "none"
        }}
      >
        <span>{t("scroll")}</span>
        <ChevronDown size={20} className="animate-bounce" />
      </div>
    </section>
  );
}

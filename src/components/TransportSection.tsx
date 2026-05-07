"use client";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { Truck, Plane, FileText, Shield, ArrowRight } from "lucide-react";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

// Animated 3D Jeep-like vehicle (simplified box model)
function JeepModel() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.5;
      groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.1;
    }
  });
  return (
    <group ref={groupRef}>
      {/* Body */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2, 0.7, 1]} />
        <meshStandardMaterial color="#1a3d2b" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0.1, 0.85, 0]}>
        <boxGeometry args={[1.1, 0.55, 0.9]} />
        <meshStandardMaterial color="#2d6a4f" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Wheels */}
      {[[-0.75, -0.1, 0.55], [0.75, -0.1, 0.55], [-0.75, -0.1, -0.55], [0.75, -0.1, -0.55]].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.2, 16]} />
          <meshStandardMaterial color="#0d1117" roughness={0.9} />
        </mesh>
      ))}
      {/* Headlights */}
      <mesh position={[1.02, 0.3, 0.3]}>
        <boxGeometry args={[0.05, 0.15, 0.2]} />
        <meshStandardMaterial color="#c9a84c" emissive="#c9a84c" emissiveIntensity={1} />
      </mesh>
      <mesh position={[1.02, 0.3, -0.3]}>
        <boxGeometry args={[0.05, 0.15, 0.2]} />
        <meshStandardMaterial color="#c9a84c" emissive="#c9a84c" emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

const CARDS = [
  { key: "jeep", icon: Truck, color: "#1a3d2b" },
  { key: "flight", icon: Plane, color: "#40916c" },
  { key: "visa", icon: FileText, color: "#c9a84c" },
  { key: "safety", icon: Shield, color: "#2d6a4f" },
];

export default function TransportSection() {
  const t = useTranslations("transport");
  const headRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(headRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.9, scrollTrigger: { trigger: headRef.current, start: "top 85%" } });
    if (cardsRef.current) {
      gsap.fromTo(cardsRef.current.children, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: cardsRef.current, start: "top 80%" } });
    }
    gsap.fromTo(canvasRef.current, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1, ease: "power3.out", scrollTrigger: { trigger: canvasRef.current, start: "top 80%" } });
  }, []);

  return (
    <section id="transport" className="section-padding" style={{ background: "#f8f9fa" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div ref={headRef} style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span className="section-badge">{t("title")}</span>
          <h2 className="section-title">{t("title")}</h2>
          <p className="section-subtitle" style={{ margin: "0.75rem auto 0" }}>{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Info Cards */}
          <div ref={cardsRef} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {CARDS.map(({ key, icon: Icon, color }) => (
              <div key={key} className="card-hover" style={{ display: "flex", gap: "1.25rem", background: "#fff", borderRadius: 16, padding: "clamp(1rem, 4vw, 1.5rem)", boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={22} color={color} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontFamily: "'Playfair Display',serif", fontSize: "1.05rem", fontWeight: 700, color: "#0d1117", marginBottom: "0.35rem" }}>
                    {t(`${key}_title` as "jeep_title" | "flight_title" | "visa_title" | "safety_title")}
                  </h4>
                  <p style={{ fontSize: "0.87rem", color: "#6c757d", lineHeight: 1.65, marginBottom: "0.6rem" }}>
                    {t(`${key}_desc` as "jeep_desc" | "flight_desc" | "visa_desc" | "safety_desc")}
                  </p>
                  <a href="#contact" style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", color: color, fontWeight: 700, fontSize: "0.8rem", textDecoration: "none" }}>
                    {t("learn_more")} <ArrowRight size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* 3D Jeep Canvas */}
          <div ref={canvasRef} style={{ height: 420, borderRadius: 24, overflow: "hidden", background: "linear-gradient(135deg,#1a3d2b,#2d6a4f)", boxShadow: "0 20px 60px rgba(26,61,43,0.25)" }}>
            <Canvas camera={{ position: [0, 1.5, 5], fov: 45 }}>
              <ambientLight intensity={0.7} />
              <directionalLight position={[5, 8, 5]} intensity={1.5} color="#c9a84c" />
              <directionalLight position={[-5, 3, -2]} intensity={0.5} color="#40916c" />
              <pointLight position={[0, 3, 0]} intensity={0.5} />
              <JeepModel />
              {/* Ground plane */}
              <mesh position={[0, -0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[10, 10]} />
                <meshStandardMaterial color="#152e1f" roughness={1} />
              </mesh>
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  );
}

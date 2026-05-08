"use client";
import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Truck, Plane, FileText, Shield, ArrowRight } from "lucide-react";
import "@/styles/globe.css";

gsap.registerPlugin(ScrollTrigger);

// PerspectiveTransform Library Core
const createPerspectiveTransform = (el: HTMLElement, w: number, h: number, useBackFacing: boolean = false) => {
  const style = el.style;
  const computedStyle = window.getComputedStyle(el);
  const state = {
    topLeft: { x: 0, y: 0 },
    topRight: { x: w, y: 0 },
    bottomLeft: { x: 0, y: h },
    bottomRight: { x: w, y: h },
  };

  const stylePrefix = "webkitTransform" in style ? "webkit" : "MozTransform" in style ? "Moz" : "msTransform" in style ? "ms" : "";
  const transformProperty = stylePrefix + (stylePrefix.length > 0 ? "Transform" : "transform");
  const transformOriginProperty = "-" + stylePrefix.toLowerCase() + "-transform-origin";

  const checkError = () => {
    const pts = [state.topLeft, state.topRight, state.bottomLeft, state.bottomRight];
    for (let i = 0; i < 4; i++) {
      for (let j = i + 1; j < 4; j++) {
        const dx = pts[i].x - pts[j].x;
        const dy = pts[i].y - pts[j].y;
        if (Math.sqrt(dx * dx + dy * dy) <= 1) return true;
      }
    }
    return false;
  };

  const calc = () => {
    const x = w, v = h;
    let E = 0, D = 0;
    const t = computedStyle.getPropertyValue(transformOriginProperty);
    if (t.indexOf("px") > -1) {
      const parts = t.split("px");
      E = -parseFloat(parts[0]);
      D = -parseFloat(parts[1]);
    }

    const G = [state.topLeft, state.topRight, state.bottomLeft, state.bottomRight];
    const m = Array.from({ length: 8 }, () => new Float64Array(8));
    const b = new Float64Array(8);

    for (let i = 0; i < 4; i++) {
      m[i][0] = m[i + 4][3] = i & 1 ? x + E : E;
      m[i][1] = m[i + 4][4] = i > 1 ? v + D : D;
      m[i][6] = (i & 1 ? -E - x : -E) * (G[i].x + E);
      m[i][7] = (i > 1 ? -D - v : -D) * (G[i].x + E);
      m[i + 4][6] = (i & 1 ? -E - x : -E) * (G[i].y + D);
      m[i + 4][7] = (i > 1 ? -D - v : -D) * (G[i].y + D);
      b[i] = G[i].x + E;
      b[i + 4] = G[i].y + D;
      m[i][2] = m[i + 4][5] = 1;
    }

    // Gaussian elimination
    for (let i = 0; i < 8; i++) {
      let max = i;
      for (let j = i + 1; j < 8; j++) if (Math.abs(m[j][i]) > Math.abs(m[max][i])) max = j;
      [m[i], m[max]] = [m[max], m[i]];
      [b[i], b[max]] = [b[max], b[i]];
      for (let j = i + 1; j < 8; j++) {
        const factor = m[j][i] / m[i][i];
        b[j] -= factor * b[i];
        for (let k = i; k < 8; k++) m[j][k] -= factor * m[i][k];
      }
    }
    const q = new Float64Array(8);
    for (let i = 7; i >= 0; i--) {
      let sum = 0;
      for (let j = i + 1; j < 8; j++) sum += m[i][j] * q[j];
      q[i] = (b[i] - sum) / m[i][i];
    }

    const matrix = `matrix3d(${q[0]},${q[3]},0,${q[6]},${q[1]},${q[4]},0,${q[7]},0,0,1,0,${q[2]},${q[5]},0,1)`;
    // @ts-ignore
    style[transformProperty] = matrix;
  };

  return { state, calc, checkError, style };
};

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
  const worldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Animations
    gsap.fromTo(headRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.9, scrollTrigger: { trigger: headRef.current, start: "top 85%" } });
    if (cardsRef.current) {
      gsap.fromTo(cardsRef.current.children, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.6, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: cardsRef.current, start: "top 80%" } });
    }

    // Globe Logic
    const URLS = {
      bg: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/6043/css_globe_bg.jpg',
      diffuse: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/6043/css_globe_diffuse.jpg',
      halo: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/6043/css_globe_halo.png',
    };

    let config = { lat: 0, lng: 0, segX: 14, segY: 12, autoSpin: true };
    let isMouseDown = false;
    let dragX = 0, dragY = 0, dragLat = 0, dragLng = 0;
    let globeDoms: any[] = [];
    let vertices: any[] = [];
    let tick = 0;

    const container = worldRef.current;
    if (!container) return;

    const globeContainer = container.querySelector('.world-globe-doms-container') as HTMLElement;
    const globePole = container.querySelector('.world-globe-pole') as HTMLElement;
    const globeHalo = container.querySelector('.world-globe-halo') as HTMLElement;
    const worldBg = container.querySelector('.world-bg') as HTMLElement;

    worldBg.style.backgroundImage = `url(${URLS.bg})`;
    globeHalo.style.backgroundImage = `url(${URLS.halo})`;

    const segWidth = 1600 / config.segX | 0;
    const segHeight = 800 / config.segY | 0;
    const radius = 536 / 2;

    const generate = () => {
      vertices = [];
      for (let y = 0; y <= config.segY; y++) {
        let row = [];
        for (let x = 0; x <= config.segX; x++) {
          let u = x / config.segX;
          let v = 0.05 + y / config.segY * 0.9;
          row.push({
            x: -radius * Math.cos(u * Math.PI * 2) * Math.sin(v * Math.PI),
            y: -radius * Math.cos(v * Math.PI),
            z: radius * Math.sin(u * Math.PI * 2) * Math.sin(v * Math.PI)
          });
        }
        vertices.push(row);
      }

      for (let y = 0; y < config.segY; y++) {
        for (let x = 0; x < config.segX; x++) {
          const dom = document.createElement('div');
          dom.style.position = 'absolute';
          dom.style.width = segWidth + 'px';
          dom.style.height = segHeight + 'px';
          dom.style.backgroundImage = `url(${URLS.diffuse})`;
          dom.style.backgroundPosition = `${-segWidth * x}px ${-segHeight * y}px`;
          dom.style.transformOrigin = '0 0';
          const pt = createPerspectiveTransform(dom, segWidth, segHeight);
          globeDoms.push({ dom, pt, v1: vertices[y][x], v2: vertices[y][x+1], v3: vertices[y+1][x], v4: vertices[y+1][x+1] });
          globeContainer.appendChild(dom);
        }
      }
    };

    generate();

    const rotate = (v: any, sinRX: number, cosRX: number, sinRY: number, cosRY: number) => {
      let x0 = v.x * cosRY - v.z * sinRY;
      let z0 = v.z * cosRY + v.x * sinRY;
      let y0 = v.y * cosRX - z0 * sinRX;
      z0 = z0 * cosRX + v.y * sinRX;
      let offset = 1 + (z0 / 4000);
      v.px = x0 * offset;
      v.py = y0 * offset;
    };

    const expand = (v1: any, v2: any) => {
      let dx = v2.px - v1.px, dy = v2.py - v1.py;
      let det = dx * dx + dy * dy;
      if (det === 0) { v1.tx = v1.px; v1.ty = v1.py; v2.tx = v2.px; v2.ty = v2.py; return; }
      let idet = 1.5 / Math.sqrt(det);
      dx *= idet; dy *= idet;
      v2.tx = v2.px + dx; v2.ty = v2.py + dy;
      v1.tx = v1.px - dx; v1.ty = v1.py - dy;
    };

    const render = () => {
      if (config.autoSpin && !isMouseDown) config.lng = (config.lng - 0.2 + 180) % 360 - 180;
      let rX = config.lat / 180 * Math.PI;
      let rY = (config.lng - 270) / 180 * Math.PI;
      let sX = Math.sin(-rX), cX = Math.cos(-rX), sY = Math.sin(rY), cY = Math.cos(rY);

      if (tick ^= 1) {
        vertices.flat().forEach(v => rotate(v, sX, cX, sY, cY));
        globeDoms.forEach(g => {
          expand(g.v1, g.v2); expand(g.v2, g.v3); expand(g.v3, g.v4); expand(g.v4, g.v1);
          g.pt.state.topLeft.x = g.v1.tx; g.pt.state.topLeft.y = g.v1.ty;
          g.pt.state.topRight.x = g.v2.tx; g.pt.state.topRight.y = g.v2.ty;
          g.pt.state.bottomLeft.x = g.v3.tx; g.pt.state.bottomLeft.y = g.v3.ty;
          g.pt.state.bottomRight.x = g.v4.tx; g.pt.state.bottomRight.y = g.v4.ty;
          if (!g.pt.checkError()) g.pt.calc();
        });
      }
      requestAnimationFrame(render);
    };

    render();

    const onDown = (e: any) => { isMouseDown = true; dragX = e.pageX; dragY = e.pageY; dragLat = config.lat; dragLng = config.lng; };
    const onMove = (e: any) => { if (isMouseDown) { config.lat = Math.max(-90, Math.min(90, dragLat + (e.pageY - dragY) * 0.5)); config.lng = (dragLng - (e.pageX - dragX) * 0.5 + 180) % 360 - 180; } };
    const onUp = () => isMouseDown = false;

    container.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    return () => {
      container.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  return (
    <section id="transport" className="section-padding bg-slate-50">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={headRef} className="text-center mb-16">
          <span className="section-badge">{t("title")}</span>
          <h2 className="section-title">{t("title")}</h2>
          <p className="section-subtitle">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div ref={cardsRef} className="space-y-6">
            {CARDS.map(({ key, icon: Icon, color }) => (
              <div key={key} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-6 hover:shadow-xl transition-all duration-500">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${color}15` }}>
                  <Icon size={24} color={color} />
                </div>
                <div>
                  <h4 className="font-playfair font-bold text-xl mb-2">{t(`${key}_title` as any)}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{t(`${key}_desc` as any)}</p>
                  <a href="#booking" className="inline-flex items-center gap-2 font-bold text-xs uppercase tracking-widest" style={{ color }}>
                    {t("learn_more")} <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div className="world-container h-[500px] shadow-2xl relative" ref={worldRef}>
             <div className="world">
                <div className="world-bg"></div>
                <div className="world-globe">
                    <div className="world-globe-pole"></div>
                    <div className="world-globe-doms-container"></div>
                    <div className="world-globe-halo"></div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

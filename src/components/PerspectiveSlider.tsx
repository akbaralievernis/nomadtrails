"use client";
import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import "@/styles/slider.css";

const IMAGES = [
  "/images/hero_forest.png",
  "/images/hero_lake.png",
  "/images/hero_cliffs.png",
  "/images/hero_mountains.png",
  "/images/hero_peaks.png"
];

const SLIDE_KEYS = ["forest", "lake", "cliffs", "mountains", "peaks"];

export default function PerspectiveSlider() {
  const t = useTranslations("hero.slider");
  const [activeId, setActiveId] = useState(1);
  const [prevId, setPrevId] = useState(1);
  const [inTransit, setInTransit] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [bgNext, setBgNext] = useState(false);
  
  const sliderRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const lastPos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });
  const animationFrame = useRef<number | null>(null);

  useEffect(() => {
    const handleResize = () => {
      const bkp = 650;
      setIsMobile(window.innerWidth <= bkp);
    };
    
    handleResize();
    // Set initial position to center to avoid jumpy starts
    targetPos.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    lastPos.current = { ...targetPos.current };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getCoefficients = (x: number, y: number) => {
    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;
    return {
      xCoeff: (x - halfW) / halfW,
      yCoeff: (halfH - y) / halfH
    };
  };

  const runAnimation = () => {
    const fraction = 0.08;
    lastPos.current.x += (targetPos.current.x - lastPos.current.x) * fraction;
    lastPos.current.y += (targetPos.current.y - lastPos.current.y) * fraction;

    const { xCoeff, yCoeff } = getCoefficients(lastPos.current.x, lastPos.current.y);
    
    if (contentRef.current && !isMobile) {
      const maxX = 8;
      const maxY = 8;
      contentRef.current.style.transform = `
        translateZ(8.519vw)
        rotateX(${maxY * yCoeff}deg)
        rotateY(${maxX * xCoeff}deg)
      `;
    }

    const activeImg = sliderRef.current?.querySelector(".slider__images-item--active img") as HTMLImageElement;
    if (activeImg) {
      activeImg.style.transform = `translateX(${-xCoeff}em) translateY(${yCoeff}em)`;
    }

    const dist = Math.abs(lastPos.current.x - targetPos.current.x) + Math.abs(lastPos.current.y - targetPos.current.y);
    if (dist > 0.1) {
      animationFrame.current = requestAnimationFrame(runAnimation);
    } else {
      animationFrame.current = null;
    }
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    targetPos.current = { x: e.pageX, y: e.pageY };
    if (!animationFrame.current) {
      animationFrame.current = requestAnimationFrame(runAnimation);
    }
  };

  const startTransition = (nextId: number) => {
    if (inTransit || nextId === activeId) return;
    setInTransit(true);
    setPrevId(activeId);
    
    if (!isMobile) {
      document.documentElement.style.setProperty("--img-next", `url("${IMAGES[nextId - 1]}")`);
      setBgNext(true);
      setTimeout(() => {
        document.documentElement.style.setProperty("--img-prev", `url("${IMAGES[nextId - 1]}")`);
        setBgNext(false);
      }, 700);
    }

    setTimeout(() => {
      setActiveId(nextId);
      document.documentElement.style.setProperty("--from-left", nextId.toString());
      setTimeout(() => setInTransit(false), 700);
    }, 350);
  };

  const next = () => startTransition(activeId === IMAGES.length ? 1 : activeId + 1);
  const prev = () => startTransition(activeId === 1 ? IMAGES.length : activeId - 1);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const autoSlide = () => {
      if (!inTransit) next();
      timer = setTimeout(autoSlide, 5000);
    };
    const stopAutoSlide = () => {
      clearTimeout(timer);
    };
    timer = setTimeout(autoSlide, 3000);
    window.addEventListener("mousedown", stopAutoSlide);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousedown", stopAutoSlide);
    };
  }, [activeId, inTransit]);

  return (
    <div 
      id="slider" 
      ref={sliderRef}
      className={`slider-container ${bgNext ? "slider--bg-next" : ""}`}
      onMouseMove={onMouseMove}
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "--img-prev": `url("${IMAGES[activeId - 1]}")`,
        "--img-next": `url("${IMAGES[activeId === IMAGES.length ? 0 : activeId]}")`
      } as any}
    >
      <div id="slider-content" ref={contentRef} className="slider__content">
        <div className="slider__images">
          {IMAGES.map((src, i) => {
            const id = i + 1;
            let className = "slider__images-item";
            if (id === activeId) className += " slider__images-item--active";
            if (id === prevId && inTransit) className += " slider__images-item--subactive";
            
            if (inTransit) {
              className += " slider__images-item--transit";
              if (id === activeId) {
                 className += activeId > prevId ? " slider__images-item--next" : " slider__images-item--prev";
              }
            }

            return (
              <div key={i} className={className} data-id={id}>
                <img 
                  src={src} 
                  alt="" 
                  crossOrigin="anonymous"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                />
              </div>
            );
          })}
        </div>

        <div className="slider__text">
          {SLIDE_KEYS.map((key, i) => {
            const id = i + 1;
            let className = "slider__text-item";
            if (id === activeId && !inTransit) className += " slider__text-item--active";
            if (id === prevId && inTransit) className += " slider__text-item--backwards";
            
            return (
              <div key={i} className={className} data-id={id}>
                <div className="slider__text-item-head">
                  <h3>{t(`${key}.head`)}</h3>
                </div>
                <div className="slider__text-item-info">
                  <p>{t(`${key}.info`)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="slider__nav">
        <div className="slider__nav-arrows">
          <div id="left" className="slider__nav-arrow slider__nav-arrow--left" onClick={prev}>to left</div>
          <div id="right" className="slider__nav-arrow slider__nav-arrow--right" onClick={next}>to right</div>
        </div>
        <div id="slider-dots" className="slider__nav-dots">
          {IMAGES.map((_, i) => (
            <div 
              key={i} 
              className={`slider__nav-dot ${i + 1 === activeId ? "slider__nav-dot--active" : ""}`}
              onClick={() => startTransition(i + 1)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

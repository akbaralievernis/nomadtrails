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

function lerp({ x, y }: { x: number; y: number }, { x: targetX, y: targetY }: { x: number; y: number }) {
  const fraction = 0.1;
  x += (targetX - x) * fraction;
  y += (targetY - y) * fraction;
  return { x, y };
}

export default function PerspectiveSlider() {
  const t = useTranslations("hero.slider");
  const [activeId, setActiveId] = useState(1);
  const [prevId, setPrevId] = useState(1);
  const [inTransit, setInTransit] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [bgNext, setBgNext] = useState(false);
  const [isBackwards, setIsBackwards] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const lastPos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });
  const animationFrame = useRef<number | null>(null);
  const mouseWatched = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      const bkp = 650;
      const mobile = window.innerWidth <= bkp;
      setIsMobile(mobile);
      
      if (!mobile && !mouseWatched.current) {
        mouseWatched.current = true;
        document.documentElement.style.setProperty("--img-prev", `url("${IMAGES[activeId - 1]}")`);
      } else if (mobile && mouseWatched.current) {
        mouseWatched.current = false;
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    
    // Auto-slide
    let timer = setTimeout(autoSlide, 2000);
    
    function autoSlide() {
      next();
      timer = setTimeout(autoSlide, 5000);
    }

    const stopAutoSlide = () => clearTimeout(timer);
    window.addEventListener("mousedown", stopAutoSlide);
    window.addEventListener("touchstart", stopAutoSlide);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
      window.removeEventListener("mousedown", stopAutoSlide);
      window.removeEventListener("touchstart", stopAutoSlide);
    };
  }, [activeId, inTransit]);

  const getCoefficients = (x: number, y: number) => {
    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;
    return {
      xCoeff: (x - halfW) / halfW,
      yCoeff: (halfH - y) / halfH
    };
  };

  const runAnimation = () => {
    lastPos.current = lerp(lastPos.current, targetPos.current);
    const { xCoeff, yCoeff } = getCoefficients(lastPos.current.x, lastPos.current.y);

    if (contentRef.current && !isMobile) {
      const maxX = 10;
      const maxY = 10;
      contentRef.current.style.transform = `
        translateZ(8.519vw)
        rotateX(${maxY * yCoeff}deg)
        rotateY(${maxX * xCoeff}deg)
      `;
      
      // Position active image
      const activeImg = sliderRef.current?.querySelector(".slider__images-item--active img") as HTMLImageElement;
      if (activeImg) {
        activeImg.style.transform = `translateX(${-xCoeff}em) translateY(${yCoeff}em)`;
      }
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
    setIsBackwards(true);
    
    // Transition text out
    setTimeout(() => {
      setIsBackwards(false);
      setPrevId(activeId);
      setActiveId(nextId);
      document.documentElement.style.setProperty("--from-left", nextId.toString());

      if (!isMobile) {
        const imageUrl = `url("${IMAGES[nextId - 1]}")`;
        document.documentElement.style.setProperty("--img-next", imageUrl);
        setBgNext(true);
        
        setTimeout(() => {
          document.documentElement.style.setProperty("--img-prev", imageUrl);
          setBgNext(false);
          setInTransit(false);
        }, 700);
      } else {
        setInTransit(false);
      }
    }, 700);
  };

  const next = () => {
    const nextId = activeId === IMAGES.length ? 1 : activeId + 1;
    startTransition(nextId);
  };

  const prev = () => {
    const nextId = activeId === 1 ? IMAGES.length : activeId - 1;
    startTransition(nextId);
  };

  return (
    <div 
      id="slider" 
      ref={sliderRef}
      className={`slider-container ${bgNext ? "slider--bg-next" : ""}`}
      onMouseMove={onMouseMove}
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
                <img src={src} alt="" />
              </div>
            );
          })}
        </div>

        <div className="slider__text">
          {SLIDE_KEYS.map((key, i) => {
            const id = i + 1;
            let className = "slider__text-item";
            if (id === activeId && !inTransit) className += " slider__text-item--active";
            if (id === prevId && isBackwards) className += " slider__text-item--backwards";
            
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
              data-id={i + 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

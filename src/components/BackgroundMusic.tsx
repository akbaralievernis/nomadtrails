"use client";
import { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Check if user has previously interacted or saved preference
    const savedMusic = localStorage.getItem("bg-music-enabled");
    if (savedMusic === "true") {
      setIsMuted(false);
    }
  }, []);

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (!isPlaying) {
      audioRef.current.play().catch(err => console.log("Autoplay blocked:", err));
      setIsPlaying(true);
      setIsMuted(false);
      localStorage.setItem("bg-music-enabled", "true");
    } else {
      if (isMuted) {
        audioRef.current.muted = false;
        setIsMuted(false);
        localStorage.setItem("bg-music-enabled", "true");
      } else {
        audioRef.current.muted = true;
        setIsMuted(true);
        localStorage.setItem("bg-music-enabled", "false");
      }
    }
  };

  return (
    <div style={{ position: "fixed", bottom: "clamp(1.5rem, 6vw, 2.5rem)", right: "clamp(1.5rem, 6vw, 2.5rem)", zIndex: 1000 }}>
      <audio
        ref={audioRef}
        src="/audio/bg_music.mp3"
        loop
        muted={isMuted}
        onPlay={() => setIsPlaying(true)}
      />
      
      <button
        onClick={toggleMusic}
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: isMuted ? "rgba(255,255,255,0.15)" : "rgba(26,61,43,0.85)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: isMuted ? "none" : "0 8px 32px rgba(26,61,43,0.3)",
          color: "#fff",
        }}
        title={isMuted ? "Play Music" : "Mute Music"}
        className="music-toggle"
      >
        {!isPlaying || isMuted ? <VolumeX size={20} /> : <Volume2 size={20} className="pulse-animation" />}
        
        {/* Visualizer bars (static representation) */}
        {!isMuted && (
           <div style={{ position: "absolute", bottom: "-10px", display: "flex", gap: "2px", height: "15px", alignItems: "flex-end" }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="v-bar" style={{ width: "2px", background: "#c9a84c", borderRadius: "1px" }} />
              ))}
           </div>
        )}
      </button>

      <style jsx>{`
        .music-toggle:hover {
          transform: scale(1.1);
          background: rgba(64,145,108,0.9);
        }
        .pulse-animation {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.15); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
        .v-bar {
          animation: bar-pulse 1s infinite ease-in-out;
        }
        .v-bar:nth-child(2) { animation-delay: 0.2s; }
        .v-bar:nth-child(3) { animation-delay: 0.4s; }
        .v-bar:nth-child(4) { animation-delay: 0.6s; }
        @keyframes bar-pulse {
          0%, 100% { height: 4px; }
          50% { height: 12px; }
        }
      `}</style>
    </div>
  );
}

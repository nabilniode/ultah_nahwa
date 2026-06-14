import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import LoveChatFinale from './LoveChatFinale';

// We have 19 photos from public/photos
const PHOTOS = Array.from({ length: 19 }, (_, i) => `/photos/foto${i + 1}.jpg`);
const BG_HEARTS = Array.from({ length: 15 }, (_, i) => i);

const GrandFinale = () => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ w: 1000, h: 800, vmin: 800 });
  const [isHeartFormed, setIsHeartFormed] = useState(false);

  useEffect(() => {
    const updateDimensions = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setDimensions({ w, h, vmin: Math.min(w, h) });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setIsHeartFormed(latest >= 0.85);
  });

  // Fade and scale in the final text message
  const finalOpacity = useTransform(scrollYProgress, [0.82, 0.95], [0, 1]);
  const finalScale = useTransform(scrollYProgress, [0.82, 0.95], [0.85, 1]);
  const finalY = useTransform(scrollYProgress, [0.82, 0.95], [30, 0]);

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-[220vh] bg-gradient-to-b from-cream-dark via-blush-light to-cream-light overflow-hidden"
    >
      {/* SVG Clip Path Definition for the Heart */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <clipPath id="heart-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.5,0.95 C0.5,0.95 0.05,0.6 0.05,0.3 A0.25,0.25 0 0 1 0.5,0.15 A0.25,0.25 0 0 1 0.95,0.3 C0.95,0.6 0.5,0.95 0.5,0.95 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* Floating Background Hearts */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {BG_HEARTS.map((idx) => {
          const seed = idx + 1;
          const left = ((Math.sin(seed * 45.3) * 0.5 + 0.5) * 100) + '%';
          const delay = (Math.cos(seed * 23.1) * 6 + 6) + 's';
          const duration = (Math.abs(Math.sin(seed * 89.4)) * 12 + 12) + 's';
          const size = (Math.abs(Math.cos(seed * 12.5)) * 18 + 10) + 'px';
          
          return (
            <span
              key={idx}
              className="absolute bottom-[-30px] text-rose-300/30 select-none float-heart"
              style={{
                left,
                animationDelay: delay,
                animationDuration: duration,
                fontSize: size,
              }}
            >
              ♥
            </span>
          );
        })}
      </div>

      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden z-10">
        {/* Soft Ambient Glow in Center */}
        <div className="absolute w-96 h-96 rounded-full bg-rose-200/30 filter blur-3xl mix-blend-multiply pointer-events-none z-0" />

        {/* Render all scattered photos in a heartbeat-active container */}
        <div 
          className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-700 z-10 ${
            isHeartFormed ? 'heartbeat-active' : ''
          }`}
        >
          {PHOTOS.map((src, index) => (
            <PhotoElement 
              key={`${index}-${dimensions.w}-${dimensions.h}`} 
              src={src} 
              index={index} 
              total={PHOTOS.length} 
              progress={scrollYProgress} 
              dimensions={dimensions}
            />
          ))}
        </div>

        {/* Final Romantic Message (Love Chat Interface) */}
        <motion.div 
          style={{ opacity: finalOpacity, scale: finalScale, y: finalY }}
          className="absolute z-20 flex flex-col items-center justify-center pointer-events-none px-4"
        >
          <LoveChatFinale />
        </motion.div>
      </div>

      {/* Embedded inline styles for animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          15% { transform: scale(1.05); }
          30% { transform: scale(1.02); }
          45% { transform: scale(1.07); }
          60% { transform: scale(1); }
        }
        .heartbeat-active {
          animation: heartbeat 1.8s infinite ease-in-out;
        }

        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-110vh) rotate(360deg);
            opacity: 0;
          }
        }
        .float-heart {
          animation: floatUp linear infinite;
        }
      `}} />
    </div>
  );
};

const PhotoElement = ({ src, index, total, progress, dimensions }) => {
  const { w, h, vmin } = dimensions;
  
  // 1. Pseudo-random generator based on index to ensure stable initial positions
  const seed = index + 1;
  const randomX = (Math.sin(seed * 12.9898) * 43758.5453 % 1) * 2 - 1; // -1 to 1
  const randomY = (Math.cos(seed * 78.233) * 43758.5453 % 1) * 2 - 1; // -1 to 1
  const randomRot = (Math.sin(seed * 34.567) * 43758.5453 % 1) * 60 - 30; // -30 to 30 deg
  const randomScale = 0.6 + Math.abs(Math.sin(seed * 123.456) * 43758.5453 % 1) * 0.4; // 0.6 to 1.0

  // Scatter photos far out initially (balanced inside the viewport area)
  const initialX = randomX * (w * 0.42);
  const initialY = randomY * (h * 0.42);
  const initialRot = randomRot;
  const initialScale = randomScale;

  // 2. Target Heart Coordinates (Parametric Equation)
  // Evenly distribute photos around the perimeter of the heart shape
  const t = (index / total) * Math.PI * 2;
  const heartX = 16 * Math.pow(Math.sin(t), 3);
  const rawHeartY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  // Shift vertically by 6 units to center the heart model vertically at (0,0)
  const heartY = rawHeartY - 6.0;
  
  // Scale the heart path according to the smallest viewport dimension
  const scaleFactor = vmin * 0.022;
  const targetX = heartX * scaleFactor;
  const targetY = heartY * scaleFactor;
  
  // Add a slight natural rotation to the final photos for a collage feel
  const finalRot = (Math.sin(seed * 99) * 20) - 10; // -10 to +10 degrees
  const targetScale = 1.0;

  // 3. Setup Scroll Transform Hooks
  // We use scroll progress from 0.05 to 0.75 for the movement
  const x = useTransform(progress, [0.05, 0.75], [initialX, targetX]);
  const y = useTransform(progress, [0.05, 0.75], [initialY, targetY]);
  const rotate = useTransform(progress, [0.05, 0.75], [initialRot, finalRot]);
  const scale = useTransform(progress, [0.05, 0.75], [initialScale, targetScale]);
  
  // Fade in at the very beginning
  const opacity = useTransform(progress, [0, 0.05], [0, 1]);

  return (
    <motion.div
      style={{
        x,
        y,
        rotate,
        scale,
        opacity,
        position: 'absolute',
        filter: "drop-shadow(0px 8px 16px rgba(212, 117, 117, 0.25))",
      }}
      whileHover={{
        scale: 1.15,
        rotate: 0,
        zIndex: 50,
        filter: "drop-shadow(0px 15px 25px rgba(212, 117, 117, 0.35))",
        transition: { duration: 0.2, ease: "easeOut" }
      }}
      className="will-change-transform cursor-pointer"
    >
      {/* The container that has the heart clip-path */}
      <div 
        className="w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 bg-white p-1"
        style={{
          clipPath: "url(#heart-clip)",
          WebkitClipPath: "url(#heart-clip)",
        }}
      >
        <img 
          src={src} 
          alt={`Memory ${index + 1}`} 
          className="w-full h-full object-cover pointer-events-none rounded-[15%]"
        />
      </div>
    </motion.div>
  );
};

export default GrandFinale;

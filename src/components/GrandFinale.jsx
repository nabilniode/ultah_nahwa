import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// We have 19 photos based on the user's directory
const PHOTOS = Array.from({ length: 19 }, (_, i) => `/photos/foto${i + 1}.jpg`);

const GrandFinale = () => {
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ w: 1000, h: 800, vmin: 800 });

  useEffect(() => {
    const updateDimensions = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setDimensions({ w, h, vmin: Math.min(w, h) });
    };
    
    // Set initial dimensions
    updateDimensions();
    
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Fade and scale in the final text message
  const finalOpacity = useTransform(scrollYProgress, [0.75, 0.95], [0, 1]);
  const finalScale = useTransform(scrollYProgress, [0.75, 0.95], [0.8, 1]);
  const finalY = useTransform(scrollYProgress, [0.75, 0.95], [50, 0]);

  return (
    <div 
      ref={containerRef} 
      className="relative min-h-[250vh] bg-gradient-to-b from-cream-dark via-blush-light to-cream-light overflow-hidden"
    >
      {/* SVG Clip Path Definition for the Heart */}
      <svg width="0" height="0" className="absolute pointer-events-none">
        <defs>
          <clipPath id="heart-clip" clipPathUnits="objectBoundingBox">
            <path d="M0.5,0.95 C0.5,0.95 0.05,0.6 0.05,0.3 A0.25,0.25 0 0 1 0.5,0.15 A0.25,0.25 0 0 1 0.95,0.3 C0.95,0.6 0.5,0.95 0.5,0.95 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        
        {/* Render all scattered photos */}
        {PHOTOS.map((src, i) => (
          <PhotoElement 
            key={i} 
            src={src} 
            index={i} 
            total={PHOTOS.length} 
            progress={scrollYProgress} 
            dimensions={dimensions}
          />
        ))}

        {/* Final Romantic Message */}
        <motion.div 
          style={{ opacity: finalOpacity, scale: finalScale, y: finalY }}
          className="absolute z-10 flex flex-col items-center justify-center pointer-events-none px-4"
        >
          <div className="bg-white/40 backdrop-blur-md px-8 py-10 md:px-16 md:py-12 rounded-3xl shadow-[0_8px_32px_rgba(255,182,193,0.3)] border border-white/60 text-center">
            <h2 className="font-serif text-4xl md:text-6xl text-rose-500 font-bold mb-4 drop-shadow-sm tracking-wide">
              I Love You
            </h2>
            <p className="font-sans text-rose-400 text-xl md:text-3xl italic tracking-wide">
              Forever and Always
            </p>
            <div className="w-16 h-[2px] bg-rose-300 mx-auto mt-6 rounded-full opacity-70"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const PhotoElement = ({ src, index, total, progress, dimensions }) => {
  const { w, h, vmin } = dimensions;
  
  // 1. Pseudo-random generator based on index to ensure stable initial positions
  const seed = index + 1;
  const randomX = (Math.sin(seed * 12.9898) * 43758.5453 % 1) * 2 - 1; // -1 to 1
  const randomY = (Math.cos(seed * 78.233) * 43758.5453 % 1) * 2 - 1; // -1 to 1
  const randomRot = (Math.sin(seed * 34.567) * 43758.5453 % 1) * 360; // 0 to 360
  const randomScale = 0.5 + Math.abs(Math.sin(seed * 123.456) * 43758.5453 % 1) * 0.8; // 0.5 to 1.3

  // Scatter photos far out initially (can even start slightly outside viewport)
  const initialX = randomX * (w * 0.8);
  const initialY = randomY * (h * 0.8);
  const initialRot = randomRot;
  const initialScale = randomScale;

  // 2. Target Heart Coordinates (Parametric Equation)
  // Evenly distribute photos around the perimeter of the heart shape
  const t = (index / total) * Math.PI * 2;
  const heartX = 16 * Math.pow(Math.sin(t), 3);
  const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
  
  // Scale the heart path according to the smallest viewport dimension
  const scaleFactor = vmin * 0.024;
  const targetX = heartX * scaleFactor;
  const targetY = heartY * scaleFactor;
  
  // Add a slight natural rotation to the final photos for a collage feel
  const finalRot = (Math.sin(seed * 99) * 30) - 15; // -15 to +15 degrees
  const targetScale = 1;

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
      }}
      className="will-change-transform shadow-2xl"
    >
      {/* The container that has the heart clip-path */}
      <div 
        className="w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-white p-1"
        style={{
          clipPath: "url(#heart-clip)",
          WebkitClipPath: "url(#heart-clip)",
        }}
      >
        <img 
          src={src} 
          alt={`Memory ${index + 1}`} 
          className="w-full h-full object-cover pointer-events-none"
        />
      </div>
    </motion.div>
  );
};

export default GrandFinale;

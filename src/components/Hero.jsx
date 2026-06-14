import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Hero() {
  const containerRef = useRef(null);

  // Track the scroll position of the entire 200vh scroll space of the Hero
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Ribbon Untying Animations
  // Left half: slides left, rotates slightly counter-clockwise, and fades out
  const leftRibbonX = useTransform(scrollYProgress, [0, 0.45], [0, -350]);
  const leftRibbonRotate = useTransform(scrollYProgress, [0, 0.45], [0, -12]);
  const leftRibbonOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  // Right half: slides right, rotates slightly clockwise, and fades out
  const rightRibbonX = useTransform(scrollYProgress, [0, 0.45], [0, 350]);
  const rightRibbonRotate = useTransform(scrollYProgress, [0, 0.45], [0, 12]);
  const rightRibbonOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);

  // Knot: scales down, rotates, and fades out quickly
  const knotScale = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const knotRotate = useTransform(scrollYProgress, [0, 0.25], [0, 45]);
  const knotOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  // Behind Ribbon: Romantic text fades in, scales up, and moves up slightly
  const textScale = useTransform(scrollYProgress, [0.15, 0.75], [0.9, 1.1]);
  const textOpacity = useTransform(scrollYProgress, [0.15, 0.65], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.15, 0.75], [40, 0]);

  // Subtle scroll down hint fades out quickly
  const hintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  // Text blur decreases as we scroll down (starts soft/blurry and becomes perfectly clear at the end)
  const bgFilter = useTransform(scrollYProgress, [0.15, 0.65], ['blur(12px)', 'blur(0px)']);

  return (
    <div ref={containerRef} className="relative h-[200vh] w-full">
      {/* Sticky Wrapper - Keeps the layout fixed in place while scroll animations occur */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-cream-light">
        
        {/* Soft Ambient Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-blush/40 filter blur-3xl mix-blend-multiply opacity-70 animate-pulse pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blush-light/60 filter blur-3xl mix-blend-multiply opacity-60 animate-pulse pointer-events-none" />

        {/* Romantic Text (Behind the Ribbon) */}
        <motion.div
          style={{
            scale: textScale,
            opacity: textOpacity,
            y: textY,
            filter: bgFilter,
          }}
          className="absolute text-center px-4 max-w-4xl z-10 pointer-events-none select-none"
        >
          <span className="block font-sans uppercase tracking-[0.3em] text-xs md:text-sm text-blush-accent font-semibold mb-4">
            An Interactive Keepsake
          </span>
          <h1 className="font-serif italic font-semibold text-5xl sm:text-6xl md:text-8xl text-blush-accent leading-none drop-shadow-sm">
            A Special Journey <br />
            <span className="font-normal not-italic text-slate-800 font-serif">For You</span>
          </h1>
          <div className="w-16 h-[1px] bg-blush-dark/40 mx-auto mt-8"></div>
        </motion.div>

        {/* The Ribbon Wrapper (Foreground) */}
        <div className="relative flex items-center justify-center w-full h-full max-w-lg z-20">
          
          {/* Left Ribbon Half */}
          <motion.div
            style={{
              x: leftRibbonX,
              rotate: leftRibbonRotate,
              opacity: leftRibbonOpacity,
            }}
            className="absolute right-[50%] mr-[-2px] origin-right pointer-events-none drop-shadow-[0_10px_15px_rgba(212,117,117,0.25)]"
          >
            <svg
              viewBox="0 0 200 200"
              className="w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Left Loop */}
              <path
                d="M 200 100 C 130 50, 40 40, 40 100 C 40 160, 130 150, 200 100"
                fill="url(#leftLoopGrad)"
                stroke="#D47575"
                strokeWidth="1.5"
              />
              {/* Left Inner Fold Accent */}
              <path
                d="M 200 100 C 150 70, 70 70, 70 100 C 70 130, 150 130, 200 100"
                fill="url(#leftInnerGrad)"
                opacity="0.75"
              />
              {/* Left Tail */}
              <path
                d="M 200 100 C 160 135, 120 170, 70 200 C 95 195, 145 170, 200 100"
                fill="url(#tailGrad)"
              />
              <defs>
                <linearGradient id="leftLoopGrad" x1="40" y1="100" x2="200" y2="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FAF0F0" />
                  <stop offset="60%" stopColor="#E8A5A5" />
                  <stop offset="100%" stopColor="#D47575" />
                </linearGradient>
                <linearGradient id="leftInnerGrad" x1="70" y1="100" x2="200" y2="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#C86B6B" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="tailGrad" x1="70" y1="200" x2="200" y2="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#D47575" />
                  <stop offset="100%" stopColor="#C86B6B" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Right Ribbon Half */}
          <motion.div
            style={{
              x: rightRibbonX,
              rotate: rightRibbonRotate,
              opacity: rightRibbonOpacity,
            }}
            className="absolute left-[50%] ml-[-2px] origin-left pointer-events-none drop-shadow-[0_10px_15px_rgba(212,117,117,0.25)]"
          >
            <svg
              viewBox="0 0 200 200"
              className="w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Right Loop */}
              <path
                d="M 0 100 C 70 50, 160 40, 160 100 C 160 160, 70 150, 0 100"
                fill="url(#rightLoopGrad)"
                stroke="#D47575"
                strokeWidth="1.5"
              />
              {/* Right Inner Fold Accent */}
              <path
                d="M 0 100 C 50 70, 130 70, 130 100 C 130 130, 50 130, 0 100"
                fill="url(#rightInnerGrad)"
                opacity="0.75"
              />
              {/* Right Tail */}
              <path
                d="M 0 100 C 40 135, 80 170, 130 200 C 105 195, 55 170, 0 100"
                fill="url(#tailGradRight)"
              />
              <defs>
                <linearGradient id="rightLoopGrad" x1="160" y1="100" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FAF0F0" />
                  <stop offset="60%" stopColor="#E8A5A5" />
                  <stop offset="100%" stopColor="#D47575" />
                </linearGradient>
                <linearGradient id="rightInnerGrad" x1="130" y1="100" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FFF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#C86B6B" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="tailGradRight" x1="130" y1="200" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#D47575" />
                  <stop offset="100%" stopColor="#C86B6B" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

          {/* Center Knot */}
          <motion.div
            style={{
              scale: knotScale,
              rotate: knotRotate,
              opacity: knotOpacity,
            }}
            className="absolute z-30 pointer-events-none drop-shadow-[0_4px_8px_rgba(200,107,107,0.3)]"
          >
            <svg
              viewBox="0 0 100 100"
              className="w-16 h-16 sm:w-20 sm:h-20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Rounded Knot */}
              <rect
                x="20"
                y="20"
                width="60"
                height="60"
                rx="30"
                fill="url(#knotGrad)"
                stroke="#B05050"
                strokeWidth="1.5"
              />
              {/* Inner highlight */}
              <circle cx="50" cy="50" r="18" fill="#FFF0F0" opacity="0.3" />
              <defs>
                <linearGradient id="knotGrad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#FADADD" />
                  <stop offset="45%" stopColor="#E8A5A5" />
                  <stop offset="100%" stopColor="#C86B6B" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>

        </div>

        {/* Scroll Indicator Hint at the bottom */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-10 flex flex-col items-center gap-2 text-slate-400 select-none z-10 pointer-events-none"
        >
          <span className="font-sans text-[10px] uppercase tracking-[0.25em]">Scroll to untie</span>
          <div className="w-5 h-8 border border-slate-300 rounded-full flex justify-center p-1">
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-1 h-2 bg-blush-accent rounded-full"
            />
          </div>
        </motion.div>

      </div>
    </div>
  );
}

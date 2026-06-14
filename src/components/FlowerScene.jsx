import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Center, useGLTF } from '@react-three/drei';
import { useScroll, useMotionValueEvent, useTransform, motion } from 'framer-motion';
import * as THREE from 'three';
import FlipbookMemories from './FlipbookMemories';

// 3D Flower Model component that handles responsive background shifts on scroll
function Flower({ scrollYProgress }) {
  const { scene } = useGLTF('/flower.glb');
  const groupRef = useRef();
  
  // Vector for smooth interpolation in the frame loop
  const tempVector = new THREE.Vector3();

  useFrame((state) => {
    if (!groupRef.current) return;

    // Get the current scroll value (0 to 1 over the 300vh track)
    const scrollVal = scrollYProgress.get();

    // R3F Viewport detection for responsive placements
    const { width } = state.viewport;
    const isMobile = window.innerWidth < 768;

    let targetScale = 0;
    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;

    // Phase 1: Bloom and Center (scroll progress 0.0 -> 0.4)
    if (scrollVal <= 0.4) {
      const bloomProgress = scrollVal / 0.4;
      const easedBloom = THREE.MathUtils.smoothstep(bloomProgress, 0, 1);
      
      // Fully enlarged scale (highly immersive)
      targetScale = easedBloom * (isMobile ? 2.5 : 4.0);
      // Desktop: Shift exactly to the center of the right half (width * 0.25)
      // Mobile: Centered horizontally (0)
      targetX = isMobile ? 0 : width * 0.25;
      // Desktop: Centered vertically
      // Mobile: Shift down to make room for text at the top
      targetY = isMobile ? -width * 0.32 : -0.1;
      targetZ = 0;
    } 
    // Phase 2: Shift to Background (scroll progress 0.4 -> 1.0)
    else {
      const shiftProgress = Math.min(1, (scrollVal - 0.4) / 0.35); // shift completes by 75% scroll
      const easedShift = THREE.MathUtils.smoothstep(shiftProgress, 0, 1);
      
      // Enlarged background scales
      const desktopScale = 1.95;
      const mobileScale = 1.45;
      
      const startScale = isMobile ? 2.5 : 4.0;
      const endScale = isMobile ? mobileScale : desktopScale;
      targetScale = THREE.MathUtils.lerp(startScale, endScale, easedShift);

      // Desktop: Shift right, push back
      // Mobile: Keep centered, shift down (to make room for book), push back
      const endX = isMobile ? 0 : width * 0.25;
      const endY = isMobile ? -width * 0.45 : -0.15;
      const endZ = isMobile ? -2.0 : -1.0;

      targetX = THREE.MathUtils.lerp(isMobile ? 0 : width * 0.25, endX, easedShift);
      targetY = THREE.MathUtils.lerp(isMobile ? -width * 0.32 : -0.1, endY, easedShift);
      targetZ = THREE.MathUtils.lerp(0, endZ, easedShift);
    }

    // Smoothly interpolate scale and position for cinematic motion
    groupRef.current.scale.lerp(tempVector.set(targetScale, targetScale, targetScale), 0.07);
    
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.07);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.07);
    groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.07);

    // Continuous rotation based on scroll (up to 450 degrees)
    const targetRotationY = scrollVal * Math.PI * 2.5;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.04);

    // Ambient floating breath effect (only on Y offset)
    const breathing = Math.sin(state.clock.getElapsedTime() * 1.2) * 0.025;
    groupRef.current.position.y += breathing;
  });

  return (
    <group ref={groupRef}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
}

useGLTF.preload('/flower.glb');

function CanvasLoader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center bg-cream-light/85 backdrop-blur-md px-6 py-4 rounded-2xl border border-blush-light shadow-md">
        <div className="w-10 h-10 border-4 border-blush-dark border-t-transparent rounded-full animate-spin"></div>
        <p className="font-sans text-[10px] text-blush-accent font-semibold mt-3 tracking-widest uppercase animate-pulse">
          Blooming...
        </p>
      </div>
    </Html>
  );
}

export default function FlowerScene() {
  const containerRef = useRef(null);
  const [showFlipbook, setShowFlipbook] = useState(false);

  // Track the scroll progress of the entire FlowerScene container (now 300vh)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Fade out the Page 2 header as the book (Page 3) begins to appear
  const titleOpacity = useTransform(scrollYProgress, [0.35, 0.46], [1, 0]);

  // Listen to scroll changes to toggle flipbook entrance triggers efficiently
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest >= 0.42) {
      if (!showFlipbook) setShowFlipbook(true);
    } else {
      if (showFlipbook) setShowFlipbook(false);
    }
  });

  return (
    <div ref={containerRef} className="relative h-[300vh] w-full">
      {/* Sticky container stays locked in place for both sections */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        
        {/* Soft Vignette Overlay */}
        <div className="absolute top-0 left-0 w-full h-44 bg-gradient-to-b from-cream-light via-cream-light/75 to-transparent pointer-events-none z-20" />

        {/* Page 2 Title Overlay (fades out as we scroll into the flipbook) */}
        <motion.div
          style={{ opacity: titleOpacity }}
          className="absolute inset-0 z-30 pointer-events-none px-6 md:px-16 select-none flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto"
        >
          {/* Text Container: Left on desktop, centered & top on mobile */}
          <div className="w-full md:w-1/2 text-center md:text-left flex flex-col items-center md:items-start pt-16 md:pt-0">
            <h2 className="font-serif italic text-3xl md:text-5xl lg:text-6xl text-blush-accent font-semibold tracking-wide drop-shadow-md leading-tight md:leading-snug">
              A Bouquet <br className="hidden md:inline" /> of Memories
            </h2>
            <p className="font-sans text-[10px] md:text-xs text-slate-500 mt-3 md:mt-4 tracking-widest uppercase font-semibold">
              Touch, drag, and rotate the model to explore
            </p>
            <div className="w-16 h-[2px] bg-blush-dark/50 mt-4 md:mt-6 rounded-full"></div>
          </div>
          
          {/* Spacing spacer for 3D model placement (Right on desktop) */}
          <div className="w-full md:w-1/2 h-[35vh] md:h-full pointer-events-none" />
        </motion.div>

        {/* Page 3 Flipbook Container (slides in from bottom, pointer-events are active on the book itself) */}
        <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none p-4">
          <FlipbookMemories isVisible={showFlipbook} />
        </div>

        {/* 3D Canvas Background Container (events pass through wrapper, but are active inside the Canvas) */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <Canvas
            gl={{ antialias: true, alpha: true }}
            camera={{ position: [0, 0, 4.5], fov: 45 }}
            className="w-full h-full bg-transparent pointer-events-auto"
          >
            <ambientLight intensity={1.2} color="#FFF5F5" />
            <directionalLight position={[10, 10, 5]} intensity={2.0} color="#FFFDF9" />
            <directionalLight position={[0, 0, 10]} intensity={1.6} color="#FFFFFF" />
            <spotLight position={[-10, 20, 10]} angle={0.3} penumbra={1} intensity={2.2} color="#FADADD" />
            <pointLight position={[0, -10, -5]} intensity={0.8} color="#E8A5A5" />

            <Suspense fallback={<CanvasLoader />}>
              <Flower scrollYProgress={scrollYProgress} />
            </Suspense>

            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              autoRotate={true}
              autoRotateSpeed={0.5}
              makeDefault
            />
          </Canvas>
        </div>

      </div>
    </div>
  );
}

import { useEffect } from 'react';
import { ReactLenis, useLenis } from '@studio-freight/react-lenis';
import Hero from './components/Hero';
import FlowerScene from './components/FlowerScene';
import GrandFinale from './components/GrandFinale';

// Forces the page to start at the very top every time the app loads
function ScrollToTop() {
  const lenis = useLenis();

  useEffect(() => {
    // Wait a tick so Lenis has fully initialized, then jump to top instantly
    const timer = setTimeout(() => {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
      } else {
        window.scrollTo(0, 0);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [lenis]);

  return null;
}

function App() {
  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothTouch: true }}>
      <ScrollToTop />
      <div className="relative min-h-[700vh] bg-gradient-to-b from-cream-light via-blush-light to-cream-dark selection:bg-blush-dark selection:text-slate-800">
        
        {/* Page 1: Hero Ribbon Section */}
        <Hero />
        
        {/* Pages 2 & 3: 3D Flower Scene & Flipbook Memories */}
        <FlowerScene />
        
        {/* Page 4: Grand Finale */}
        <GrandFinale />

      </div>
    </ReactLenis>
  );
}

export default App;

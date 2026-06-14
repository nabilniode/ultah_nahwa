import { ReactLenis } from '@studio-freight/react-lenis';
import Hero from './components/Hero';
import FlowerScene from './components/FlowerScene';
import GrandFinale from './components/GrandFinale';

function App() {
  return (
    <ReactLenis root options={{ lerp: 0.08, duration: 1.2, smoothTouch: true }}>
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

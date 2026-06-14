import React, { forwardRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { motion } from 'framer-motion';

// Array mapping your 19 photos with sweet, elegant captions
const PHOTO_DATA = [
  { file: 'foto1.jpg', caption: 'The beginning of our beautiful journey...' },
  { file: 'foto2.jpg', caption: 'Hand in hand, walking together.' },
  { file: 'foto3.jpg', caption: 'Under the starry skies, dreaming with you.' },
  { file: 'foto4.jpg', caption: 'Cozy coffee dates and sweet smiles.' },
  { file: 'foto5.jpg', caption: 'Your laugh is my absolute favorite sound.' },
  { file: 'foto6.jpg', caption: 'Making everyday moments feel magical.' },
  { file: 'foto7.jpg', caption: 'Every second with you is a treasure.' },
  { file: 'foto8.jpg', caption: 'My heart is happiest when we are together.' },
  { file: 'foto9.jpg', caption: 'Capturing memories that will last forever.' },
  { file: 'foto10.jpg', caption: 'The warmth of your smile keeps me glowing.' },
  { file: 'foto11.jpg', caption: "Here's to all our silly little moments." },
  { file: 'foto12.jpg', caption: 'You are my favorite view, always.' },
  { file: 'foto13.jpg', caption: "With you, I'm home." },
  { file: 'foto14.jpg', caption: 'Blessed with the best partner in the world.' },
  { file: 'foto15.jpg', caption: 'Every day I love you more than yesterday.' },
  { file: 'foto16.jpg', caption: "Forever isn't long enough with you." },
  { file: 'foto17.jpg', caption: 'The sweetest chapter of my life.' },
  { file: 'foto18.jpg', caption: 'You make my heart skip a beat.' },
  { file: 'foto19.jpg', caption: 'To many more adventures together...' }
];

// Reusable Page component using React.forwardRef as required by react-pageflip
const BookPage = forwardRef(({ children, number, isCover = false, coverImage }, ref) => {
  return (
    <div
      className={`relative w-full h-full flex flex-col justify-between p-6 md:p-8 select-none shadow-2xl overflow-hidden ${
        isCover 
          ? 'bg-gradient-to-br from-blush to-blush-dark border-2 border-blush-accent text-white rounded-r-lg'
          : 'bg-cream-dark border-l border-cream-light/60 text-slate-800'
      }`}
      ref={ref}
      style={{
        boxShadow: isCover 
          ? 'inset -5px 0 10px rgba(0,0,0,0.15), 5px 5px 15px rgba(0,0,0,0.2)'
          : 'inset 5px 0 10px rgba(0,0,0,0.05), inset -5px 0 10px rgba(0,0,0,0.02), 5px 5px 10px rgba(0,0,0,0.08)'
      }}
    >
      {/* Background Image of the cover if provided */}
      {isCover && coverImage && (
        <img 
          src={coverImage} 
          alt="Cover Background" 
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />
      )}

      {/* Background Image of the inner pages */}
      {!isCover && (
        <img 
          src="/photos/bg flipbook.jpeg" 
          alt="Page Background" 
          className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
        />
      )}

      {/* Page Content */}
      <div className="flex-1 flex flex-col justify-center items-center h-full z-20">
        {children}
      </div>

      {/* Page Number (Not shown on covers) */}
      {!isCover && number && (
        <div className="text-right font-serif text-[10px] text-slate-400 italic mt-2 self-end z-20">
          Page {number}
        </div>
      )}
    </div>
  );
});

BookPage.displayName = 'BookPage';

// BinderRing component that renders a realistic left-bound or right-bound metallic ring
const BinderRing = ({ isRightBound }) => {
  return (
    <svg 
      viewBox="0 0 80 30" 
      className="w-12 h-4 sm:w-14 sm:h-5 opacity-95 drop-shadow-[0_2px_3px_rgba(0,0,0,0.35)]"
    >
      {isRightBound ? (
        // Right Bound (Used for Closed Back Cover on the left half)
        <>
          <circle cx="32" cy="15" r="3.2" fill="#2d1a1a" opacity="0.8" />
          <path
            d="M 32 15 C 32 -2, 52 -2, 52 15 C 52 18, 32 18, 32 15"
            fill="url(#ringSilverGradRight)"
          />
          <path
            d="M 34 12 C 37 2, 49 2, 49 14"
            stroke="#ffffff"
            strokeWidth="0.8"
            fill="none"
            opacity="0.8"
          />
          <defs>
            <linearGradient id="ringSilverGradRight" x1="32" y1="15" x2="52" y2="15" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#64748b" />
              <stop offset="25%" stopColor="#cbd5e1" />
              <stop offset="45%" stopColor="#f8fafc" />
              <stop offset="65%" stopColor="#94a3b8" />
              <stop offset="85%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>
          </defs>
        </>
      ) : (
        // Left Bound (Used for Front Cover & Open pages - ring wraps around the left edge)
        <>
          <circle cx="48" cy="15" r="3.2" fill="#2d1a1a" opacity="0.8" />
          <path
            d="M 48 15 C 48 -2, 28 -2, 28 15 C 28 18, 48 18, 48 15"
            fill="url(#ringSilverGradLeft)"
          />
          <path
            d="M 46 12 C 43 2, 31 2, 31 14"
            stroke="#ffffff"
            strokeWidth="0.8"
            fill="none"
            opacity="0.8"
          />
          <defs>
            <linearGradient id="ringSilverGradLeft" x1="28" y1="15" x2="48" y2="15" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="25%" stopColor="#cbd5e1" />
              <stop offset="45%" stopColor="#f8fafc" />
              <stop offset="75%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
          </defs>
        </>
      )}
    </svg>
  );
};

export default function FlipbookMemories({ isVisible }) {
  const [currentPage, setCurrentPage] = useState(0);

  // Total pages: Front Cover + Intro + 19 photos + Love Letter + Back Cover = 23 pages
  const totalPages = PHOTO_DATA.length + 4;
  const isClosedFront = currentPage === 0;
  const isClosedBack = currentPage === totalPages - 1;

  // Place the binder rings permanently on the left edge of the book container
  // to represent a left-bound notebook in all cover and page states.
  const ringPositionClass = "left-0 -translate-x-[42%] md:-translate-x-[36%]";

  // Metal loops are always bound on the left edge of the active page/book container
  const isRightBound = false;

  const onFlip = (e) => {
    setCurrentPage(e.data);
  };

  return (
    <motion.div
      initial={{ y: 250, opacity: 0 }}
      animate={isVisible ? { y: 0, opacity: 1 } : { y: 250, opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-4xl px-4 flex justify-center z-40 pointer-events-auto"
    >
      <div className="relative w-full aspect-[4/3] md:aspect-[1.4/1] max-w-[700px] h-auto">
        {/* Dynamic Binder Rings Spine */}
        <div className={`absolute top-[6%] bottom-[6%] w-12 flex flex-col justify-between items-center z-50 pointer-events-none transition-all duration-500 ${ringPositionClass}`}>
          {Array.from({ length: 9 }).map((_, i) => (
            <BinderRing key={i} isRightBound={isRightBound} />
          ))}
        </div>

        <HTMLFlipBook
          width={350}
          height={480}
          size="stretch"
          minWidth={240}
          maxWidth={400}
          minHeight={320}
          maxHeight={550}
          maxShadowOpacity={0.4}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={onFlip}
          className="flipbook-container mx-auto"
        >
          {/* FRONT COVER */}
          <BookPage isCover={true} coverImage="/photos/sampul.jpeg">
            {/* Glassmorphic Open Badge on the right edge */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center z-20 pointer-events-none select-none">
              <motion.div
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                className="bg-white/80 backdrop-blur-md border border-blush-light shadow-[0_8px_24px_rgba(212,117,117,0.25)] px-3 py-4 rounded-2xl flex flex-col items-center gap-1.5"
              >
                <div className="w-8 h-8 rounded-full bg-blush flex items-center justify-center border border-blush-dark/30 text-blush-accent text-xs shadow-sm">
                  ➡️
                </div>
                <span className="font-sans text-[9px] text-blush-accent uppercase tracking-[0.2em] font-bold">
                  Open
                </span>
              </motion.div>
            </div>

            {/* Glassmorphic Instruction Capsule at the bottom */}
            <div className="absolute bottom-6 left-0 w-full text-center pointer-events-none select-none z-20 px-4">
              <div className="inline-block bg-cream-light/85 backdrop-blur-sm border border-blush-light/50 px-4 py-1.5 rounded-full shadow-[0_4px_12px_rgba(212,117,117,0.15)]">
                <p className="font-sans text-[8px] md:text-[9px] text-blush-accent uppercase tracking-[0.25em] font-semibold">
                  Click or drag edge to turn page
                </p>
              </div>
            </div>
          </BookPage>

          {/* PAGE 1: Intro Text */}
          <BookPage number={1}>
            <div className="text-center p-4 flex flex-col justify-center items-center h-full gap-6">
              <span className="text-3xl text-blush-accent">✨</span>
              <h2 className="font-serif text-xl md:text-2xl text-slate-800 font-semibold italic">
                Where it all began...
              </h2>
              <p className="font-sans text-xs md:text-sm text-slate-500 leading-relaxed max-w-[240px]">
                Every single day spent with you has been a beautiful chapter in my life. This book is a collection of the moments I hold closest to my heart.
              </p>
              <div className="w-8 h-[1px] bg-blush-dark/30"></div>
            </div>
          </BookPage>

          {/* DYNAMIC PHOTO PAGES (Pages 2 through 20) */}
          {PHOTO_DATA.map((item, index) => {
            const isEven = index % 2 === 0;
            const rotateVal = isEven ? -2.5 : 2.0; // Alternate Polaroid tilts
            const tapeRotateVal = isEven ? 3 : -3; // Alternate tape tilts

            return (
              <BookPage key={item.file} number={index + 2}>
                <div className="flex flex-col items-center justify-center h-full w-full px-2">
                  {/* Polaroid Frame */}
                  <div 
                    style={{ transform: `rotate(${rotateVal}deg)` }}
                    className="bg-white p-2.5 pb-5 md:p-3 md:pb-6 shadow-xl border border-slate-100 max-w-[230px] sm:max-w-[250px] w-full relative transition-transform duration-300 hover:rotate-0"
                  >
                    {/* Washi Tape */}
                    <div 
                      style={{ transform: `translateX(-50%) rotate(${tapeRotateVal}deg)` }}
                      className={`absolute -top-3.5 left-1/2 w-14 h-4.5 border-dashed border shadow-sm z-10 ${
                        isEven 
                          ? 'bg-blush/60 border-blush-dark/20' 
                          : 'bg-blush-dark/45 border-blush-accent/30'
                      }`} 
                    />
                    
                    {/* Polaroid Image */}
                    <img
                      src={`/photos/${item.file}`}
                      alt={item.caption}
                      className="w-full aspect-square object-cover rounded shadow-inner"
                      loading="lazy"
                    />
                    
                    {/* Polaroid Caption */}
                    <p className="font-serif italic text-[11px] md:text-xs text-center text-slate-600 mt-3.5 font-medium tracking-wide">
                      {item.caption}
                    </p>
                  </div>
                </div>
              </BookPage>
            );
          })}

          {/* PAGE 21: Love Letter */}
          <BookPage number={PHOTO_DATA.length + 2}>
            <div className="text-center p-4 flex flex-col justify-center items-center h-full gap-4">
              <span className="text-2xl">❤️</span>
              <h3 className="font-serif italic text-lg text-blush-accent font-semibold">
                To My Favorite Person
              </h3>
              <p className="font-sans text-[11px] leading-relaxed text-slate-500 max-w-[250px]">
                Thank you for filling my days with warmth, laughter, and endless love. No matter how many pages we fill, you will always be my happiest chapter.
              </p>
              <div className="w-10 h-[1px] bg-blush-dark/30 my-1"></div>
              <p className="font-serif italic text-xs text-slate-400">
                Yours forever.
              </p>
            </div>
          </BookPage>

          {/* BACK COVER */}
          <BookPage isCover={true} coverImage="/photos/sampul.jpeg">
            <div className="bg-white/80 backdrop-blur-md border border-blush-light shadow-[0_8px_24px_rgba(212,117,117,0.25)] p-6 rounded-3xl text-center max-w-[200px] z-20">
              <h2 className="font-serif italic text-2xl text-blush-accent font-semibold tracking-wide">
                The End
              </h2>
              <p className="font-sans text-[9px] text-slate-500 uppercase tracking-widest font-semibold mt-2">
                Our Chapter One
              </p>
              <span className="block text-xl mt-3 animate-bounce">🌹</span>
            </div>
          </BookPage>
        </HTMLFlipBook>
      </div>
    </motion.div>
  );
}

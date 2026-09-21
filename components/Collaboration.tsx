
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { LIAM_PORTRAIT, DEFAULT_FIELD_NOTES } from '../constants';
import { Marquee } from './ui/3d-testimonails';
import { SocialCommentCard } from './SocialCommentCard';
import { MagneticButton } from './ui/MagneticButton';

export const Collaboration: React.FC = () => {
  const { aboutData } = useContent();
  const { testimonials, testimonialsBackground } = aboutData;

  const [activeNote, setActiveNote] = React.useState<number | null>(null);
  const rawNotes = aboutData.fieldNotes && aboutData.fieldNotes.length > 0 ? aboutData.fieldNotes : DEFAULT_FIELD_NOTES;
  const notes = React.useMemo(() => {
    return rawNotes.filter((fn) => fn.n !== '05' && fn.n !== '5' && fn.label?.toLowerCase() !== 'discomfort');
  }, [rawNotes]);

  const cards = React.useMemo(() => {
    // Stack presets for photos peeking out in 3D around the top active card
    const stackPresets = [
      { rot: -6.5, x: -22, y: -16, scale: 0.95, opacity: 0.92, z: 35 },
      { rot: 6.8, x: 24, y: -22, scale: 0.92, opacity: 0.84, z: 30 },
      { rot: -8.5, x: -28, y: 18, scale: 0.89, opacity: 0.74, z: 25 },
      { rot: 7.5, x: 30, y: 20, scale: 0.86, opacity: 0.64, z: 20 },
    ];

    return notes.map((it, i) => {
      let style: React.CSSProperties;
      if (activeNote === null) {
        style = {
          opacity: 0,
          transform: `translate3d(${i % 2 === 0 ? -14 : 14}px, 24px, 0) scale(0.92) rotate(${i % 2 === 0 ? -4 : 4}deg)`,
          pointerEvents: 'none',
          zIndex: 10,
        };
      } else if (i === activeNote) {
        style = {
          opacity: 1,
          zIndex: 40,
          transform: 'translate3d(0, 0, 0) scale(1.02) rotate(0deg)',
          pointerEvents: 'none',
        };
      } else {
        const dist = (i - activeNote + notes.length) % notes.length;
        const slot = stackPresets[Math.min(dist - 1, stackPresets.length - 1)];
        style = {
          opacity: slot.opacity,
          zIndex: slot.z,
          transform: `translate3d(${slot.x}px, ${slot.y}px, 0) scale(${slot.scale}) rotate(${slot.rot}deg)`,
          pointerEvents: 'none',
        };
      }
      return { ...it, style };
    });
  }, [notes, activeNote]);
  
  // Generate mathematically deconflicted column tracks ensuring:
  // 1. Adjacent columns NEVER share cards (Pool A for Odd columns 1, 3, 5; Pool B for Even columns 2, 4),
  //    guaranteeing that adjacent columns moving in opposite directions can NEVER display the same card side-by-side!
  // 2. Both Pool A and Pool B receive a balanced mix of platforms (Instagram, YouTube, Twitter, LinkedIn).
  // 3. Same-direction columns (1, 3, 5) and (2, 4) are phase-staggered so duplicate cards are offset by
  //    hundreds of pixels, ensuring as few duplicates (or zero) are visible on screen at any instant.
  const { col1, col2, col3, col4, col5, trackCount } = React.useMemo(() => {
    if (!testimonials || testimonials.length === 0) {
      return { col1: [], col2: [], col3: [], col4: [], col5: [], trackCount: 0 };
    }

    const n = testimonials.length;

    // Helper: repeat an array until it has at least minCount elements to prevent visual gaps in vertical marquee
    const padToMin = (arr: typeof testimonials, minCount = 6) => {
      let res = [...arr];
      while (res.length < minCount) {
        res = [...res, ...arr];
      }
      return res;
    };

    // Helper: rotate array by offset
    const rotate = (arr: typeof testimonials, offset: number) => {
      if (arr.length === 0) return [];
      const len = arr.length;
      const effectiveOffset = ((offset % len) + len) % len;
      return [...arr.slice(effectiveOffset), ...arr.slice(0, effectiveOffset)];
    };

    if (n >= 6) {
      // Step 1: Group by platform so we can balance platforms evenly across both pools
      const platformMap: Record<string, typeof testimonials> = {
        instagram: [],
        youtube: [],
        twitter: [],
        linkedin: [],
      };

      testimonials.forEach((t) => {
        const p = (t.platform || 'instagram').toLowerCase();
        if (!platformMap[p]) platformMap[p] = [];
        platformMap[p].push(t);
      });

      // Step 2: Deal cards alternatingly into Pool A (Down columns: 1, 3, 5) and Pool B (Up columns: 2, 4)
      const poolA: typeof testimonials = [];
      const poolB: typeof testimonials = [];
      let dealToA = true;

      const orderPlatforms = ['instagram', 'youtube', 'twitter', 'linkedin'];
      orderPlatforms.forEach((platformKey) => {
        const items = platformMap[platformKey] || [];
        items.forEach((item) => {
          if (dealToA) {
            poolA.push(item);
          } else {
            poolB.push(item);
          }
          dealToA = !dealToA;
        });
      });

      // Guard if either pool is too small
      if (poolA.length === 0) poolA.push(...poolB);
      if (poolB.length === 0) poolB.push(...poolA);

      // Step 3: Interleave platforms within each pool to prevent consecutive cards from having the same platform
      const interleavePool = (pool: typeof testimonials) => {
        const byPlat: Record<string, typeof testimonials> = {};
        pool.forEach((item) => {
          const p = (item.platform || 'instagram').toLowerCase();
          if (!byPlat[p]) byPlat[p] = [];
          byPlat[p].push(item);
        });

        const interleaved: typeof testimonials = [];
        let hasMore = true;
        let pIdx = 0;
        while (hasMore) {
          hasMore = false;
          for (const p of orderPlatforms) {
            if (byPlat[p] && pIdx < byPlat[p].length) {
              interleaved.push(byPlat[p][pIdx]);
              hasMore = true;
            }
          }
          pIdx++;
        }
        return interleaved;
      };

      const sortedPoolA = interleavePool(poolA);
      const sortedPoolB = interleavePool(poolB);

      // Step 4: Stagger starting indices for same-direction columns:
      // Odd columns (1, 3, 5) all scroll DOWN:
      // Col 1 starts at 0
      // Col 3 starts offset by ~35-45% of Pool A
      // Col 5 starts offset by ~70-80% of Pool A
      const offsetA1 = 0;
      const offsetA3 = Math.max(1, Math.round(sortedPoolA.length * 0.38));
      const offsetA5 = Math.max(2, Math.round(sortedPoolA.length * 0.72));

      // Even columns (2, 4) all scroll UP:
      // Col 2 starts at 0
      // Col 4 starts offset by ~50% of Pool B
      const offsetB2 = 0;
      const offsetB4 = Math.max(1, Math.round(sortedPoolB.length * 0.5));

      const c1 = padToMin(rotate(sortedPoolA, offsetA1), 6);
      const c2 = padToMin(rotate(sortedPoolB, offsetB2), 6);
      const c3 = padToMin(rotate(sortedPoolA, offsetA3), 6);
      const c4 = padToMin(rotate(sortedPoolB, offsetB4), 6);
      const c5 = padToMin(rotate(sortedPoolA, offsetA5), 6);

      return {
        col1: c1,
        col2: c2,
        col3: c3,
        col4: c4,
        col5: c5,
        trackCount: Math.max(c1.length, c2.length),
      };
    } else {
      // Fallback for small collections (N < 6):
      // Each column uses all cards with maximal cyclic stride so adjacent columns never align
      const c1 = padToMin(rotate(testimonials, 0), 6);
      const c2 = padToMin(rotate(testimonials, 1), 6);
      const c3 = padToMin(rotate(testimonials, 2), 6);
      const c4 = padToMin(rotate(testimonials, 3), 6);
      const c5 = padToMin(rotate(testimonials, 4), 6);

      return {
        col1: c1,
        col2: c2,
        col3: c3,
        col4: c4,
        col5: c5,
        trackCount: c1.length,
      };
    }
  }, [testimonials]);

  // Synchronize same-direction columns so their spatial offsets remain constant and never drift into collision!
  const baseDuration = Math.max(36, Math.round(trackCount * 5.2));
  // Downwards columns (1, 3, 5): locked to baseDuration to preserve constant phase distance
  const dur1 = `${baseDuration}s`;
  const dur3 = `${baseDuration}s`;
  const dur5 = `${baseDuration}s`;
  // Upwards columns (2, 4): synchronized slightly different pace for organic counter-scrolling
  const upDuration = Math.round(baseDuration * 1.12);
  const dur2 = `${upDuration}s`;
  const dur4 = `${upDuration}s`;

  // Optimize image size function
  const getOptimizedBg = (url?: string) => {
    if(!url) return "";
    if(url.includes("images.unsplash.com")) {
      const base = url.split("?")[0];
      return `${base}?q=80&w=2000&auto=format&fit=crop`;
    }
    return url;
  };

  return (
    <div className="bg-[#050505]">
      {/* Redesigned About Section */}
      <section
        id="about"
        className="relative text-[#f4f4f2] font-archivo py-[clamp(44px,5.5vw,96px)] px-[clamp(20px,5vw,80px)] flex justify-center overflow-hidden border-b border-[#161616]"
      >
        {/* Atmospheric Mountain Background Image with Turned-down Black Opacity & Animated Grain */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
          <img
            src={
              getOptimizedBg(
                aboutData.aboutBackground && !aboutData.aboutBackground.includes('St_Michael')
                  ? aboutData.aboutBackground
                  : 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2560&auto=format&fit=crop'
              )
            }
            alt="Mountain Landscape Background"
            className="w-full h-full object-cover object-center scale-105 filter brightness-[0.80] contrast-110"
          />
          {/* Black overlay with turned-down opacity so the mountain peaks & ridges emerge with moody depth */}
          <div className="absolute inset-0 bg-[#060606]/75" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/95 via-transparent to-[#050505]" />

          {/* Animated Film Grain Overlay - Fine 35mm micro-grain, subtle opacity, non-freezing continuous jitter */}
          <div
            className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] pointer-events-none opacity-[0.045] mix-blend-screen animate-grain"
            style={{
              backgroundImage: 'url("https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png")',
              backgroundSize: '150px 150px',
              backgroundRepeat: 'repeat',
            }}
          />
        </div>

        <div className="relative z-10 w-full max-w-[1320px] flex flex-col gap-[clamp(32px,3.8vw,64px)]">
          {/* Header */}
          <header className="flex flex-col gap-[clamp(16px,2vw,24px)]">
            <h2 className="m-0 text-[clamp(40px,6.5vw,96px)] leading-[0.94] tracking-[-0.035em] font-bold font-archivo text-white max-w-[16ch] text-balance">
              Visualizing <em className="italic text-[#f4f4f2]">the unseen.</em>
            </h2>
          </header>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(28px,4vw,64px)] items-start">
            {/* Portrait / Interactive Card Stack */}
            <figure
              className={`m-0 flex flex-col gap-4.5 ${
                aboutData.portraitSide === 'Right' ? 'order-1 lg:order-2' : 'order-1 lg:order-1'
              } lg:sticky lg:top-10`}
            >
              <div className="relative w-full aspect-[4/5] flex items-center justify-center select-none">
                {/* Base Portrait Container (Off-White Classic Polaroid Format) */}
                <div className="absolute inset-0 rounded-[18px] sm:rounded-[20px] will-change-transform bg-[#F4F1EA] border border-[#E2DDD2] p-3 sm:p-3.5 pb-4 sm:pb-5 flex flex-col shadow-[0_28px_65px_rgba(0,0,0,0.88),0_4px_16px_rgba(0,0,0,0.35)] overflow-hidden group">
                  {/* Polaroid Upper Photo Aperture */}
                  <div className="relative w-full flex-1 min-h-0 rounded-[10px] sm:rounded-[12px] overflow-hidden border border-black/15 bg-black shadow-[inset_0_1px_4px_rgba(0,0,0,0.35)]">
                    {/* Portrait Image */}
                    <img
                      src={aboutData.portrait || LIAM_PORTRAIT}
                      alt={aboutData.portraitName || 'Liam Leslie'}
                      className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 pointer-events-none"
                    />

                    {/* Subtle Vignette & Specular Glare */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.08] via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Polaroid Classic Bottom Chin (Liam's Portrait - Inverted Text) */}
                  <div className="pt-2.5 sm:pt-3 pb-0.5 px-2 flex flex-col items-center justify-center text-center gap-0.5 shrink-0 relative z-10">
                    <span className="font-archivo text-[15px] sm:text-[16px] font-bold tracking-[-0.01em] uppercase text-[#141414]">
                      {aboutData.portraitName || 'Liam Leslie'}
                    </span>
                    <span
                      style={{ fontFamily: "'Caveat', cursive" }}
                      className="text-[20px] sm:text-[22px] leading-none text-[#2d2a26] font-semibold tracking-wide"
                    >
                      {aboutData.portraitRole === 'Director & Cinematographer'
                        ? 'Creative Director'
                        : (aboutData.portraitRole || 'Creative Director')}
                    </span>
                  </div>
                </div>

                {/* Floating Stacked Photo Cards Deck (Off-White Classic Polaroids) */}
                <div className="absolute inset-0 pointer-events-none overflow-visible">
                  {cards.map((card, idx) => (
                    <div
                      key={card.n || idx}
                      style={card.style}
                      className="absolute inset-0 rounded-[18px] sm:rounded-[20px] will-change-transform bg-[#F4F1EA] border border-[#E2DDD2] p-3 sm:p-3.5 pb-4 sm:pb-5 flex flex-col shadow-[0_28px_65px_rgba(0,0,0,0.88),0_4px_16px_rgba(0,0,0,0.35)] transition-all duration-[500ms] ease-[cubic-bezier(0.22,0.8,0.26,1)] overflow-hidden"
                    >
                      {/* Polaroid Upper Photo Aperture */}
                      <div className="relative w-full flex-1 min-h-0 rounded-[10px] sm:rounded-[12px] overflow-hidden border border-black/15 bg-black shadow-[inset_0_1px_4px_rgba(0,0,0,0.35)]">
                        {card.image ? (
                          <>
                            <img
                              src={card.image}
                              alt={card.label}
                              className="w-full h-full object-cover select-none"
                            />
                            {/* Subtle Vignette & Specular Glare */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.08] via-transparent to-transparent pointer-events-none" />
                          </>
                        ) : (
                          <div
                            className="w-full h-full pointer-events-none flex items-center justify-center bg-black/40"
                            style={{
                              background:
                                'repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 7px, rgba(255,255,255,0.01) 7px, rgba(255,255,255,0.01) 14px)',
                            }}
                          />
                        )}
                      </div>

                      {/* Polaroid Classic Bottom Chin: Just the location only in handwriting, centered & inverted dark text */}
                      <div className="pt-2.5 sm:pt-3 pb-0.5 px-2 flex items-center justify-center text-center shrink-0 relative z-10">
                        <span
                          style={{ fontFamily: "'Caveat', cursive" }}
                          className="text-[27px] sm:text-[30px] leading-tight text-[#141414] font-bold tracking-wide"
                        >
                          {card.label}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </figure>

            {/* Content Column */}
            <div
              className={`flex flex-col gap-[clamp(20px,2.4vw,34px)] pt-1 ${
                aboutData.portraitSide === 'Right' ? 'order-2 lg:order-1' : 'order-2 lg:order-2'
              }`}
            >
              <p className="m-0 text-[clamp(18px,1.65vw,24px)] leading-[1.42] tracking-[-0.015em] text-[#f4f4f2] max-w-[34ch] font-archivo text-pretty">
                {aboutData.leadParagraph || aboutData.description}
              </p>

              {/* Field Notes Section */}
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-3 pb-2.5">
                  <span className="font-mono text-[10px] tracking-[0.26em] uppercase text-[#8d8d89]">
                    Field notes
                  </span>
                  <span className="flex-1 h-[1px] bg-[#1c1c1c] block" />
                </div>
                {notes.map((note, idx) => (
                  <div
                    key={note.n || idx}
                    onMouseEnter={() => setActiveNote(idx)}
                    onMouseLeave={() => setActiveNote(null)}
                    className="grid grid-cols-[40px_1fr] gap-3.5 items-baseline py-2.5 sm:py-3 pr-2 border-b border-[#161616] cursor-pointer transition-all duration-300 hover:pl-3 hover:bg-[#0c0c0c] rounded-lg group"
                  >
                    <span className="font-mono text-[11px] tracking-[0.1em] text-[#8d8d89] group-hover:text-white transition-colors">
                      {note.n}
                    </span>
                    <span className="text-[clamp(14px,1.1vw,16px)] leading-[1.5] text-[#c9c9c5] font-archivo group-hover:text-[#f4f4f2] transition-colors text-pretty">
                      {note.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Brand Statement */}
              <p className="m-0 text-[clamp(15px,1.2vw,17.5px)] leading-[1.6] text-[#c9c9c5] max-w-[46ch] font-archivo text-pretty">
                {aboutData.brandParagraph ? (
                  aboutData.brandParagraph
                ) : (
                  <>
                    Through <strong className="text-[#f4f4f2] font-semibold">Mavestone</strong>, Liam makes cinematic stories for founders and brands who want video that actually makes people feel something.
                  </>
                )}
              </p>

              {/* Inline Bottom Row: Punchline & CTA Buttons */}
              <div className="pt-2 md:pt-3 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-5">
                {(aboutData.showPunchline ?? true) && (
                  <p className="m-0 font-mono text-[12px] sm:text-[12.5px] leading-[1.6] tracking-[0.02em] text-[#a6a6a2] max-w-[34ch] border-l border-[#242424] pl-3.5">
                    {aboutData.punchline || "Completely unbiased bio, by the way. Liam definitely did not write this himself at 1:14am."}
                  </p>
                )}

                <div className="flex flex-row items-center gap-4 sm:gap-6 shrink-0">
                  <MagneticButton
                    variant="primary"
                    onClick={() => {
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="!px-7 md:!px-10 !py-3.5 md:!py-4 !text-xs md:!text-sm !font-black uppercase tracking-widest shadow-xl justify-center"
                  >
                    Connect
                  </MagneticButton>
                  <button
                    onClick={() => {
                      document.getElementById('films')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="flex items-center gap-2 md:gap-3 text-white font-black tracking-[0.2em] md:tracking-[0.25em] uppercase text-[10px] md:text-[11px] group cursor-pointer"
                  >
                    View All Work <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-white/40 group-hover:translate-x-2 transition-transform duration-500" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Slim Header Section - Pure clean title fading smoothly into the floating cards below */}
      <section id="testimonials" className="pt-6 pb-4 sm:pt-8 sm:pb-5 md:pt-10 md:pb-6 bg-[#050505] relative z-10">
        <div className="container px-6 md:px-12 lg:px-24 mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
                The People Have Spoken<span className="text-[#C9A96E]">.</span>
            </h2>
        </div>
      </section>

      {/* 3D Floating Social Cards Stage - Seamless atmospheric stage with soft fading boundaries */}
      <section className="relative w-full h-[620px] sm:h-[700px] md:h-[780px] lg:h-[840px] bg-[#050505] overflow-hidden flex items-center justify-center select-none">
        {/* Atmosphere Background */}
        {testimonialsBackground && (
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
                <img 
                    src={getOptimizedBg(testimonialsBackground)} 
                    alt="Atmosphere" 
                    className="w-full h-full object-cover object-center opacity-40 filter contrast-110" 
                />
            </div>
        )}

        {/* Top atmospheric fade - subtle soft edge transition */}
        <div className="absolute top-0 inset-x-0 h-16 sm:h-20 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none z-20" />

        {/* Bottom atmospheric fade */}
        <div className="absolute bottom-0 inset-x-0 h-16 sm:h-20 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-20" />

        {/* 3D Stage - Full height and fluid perspective with direct 3D preserve hierarchy */}
        <div className="relative flex w-full h-full items-center justify-center [perspective:1000px] z-10">
            <div
                className="flex flex-row items-center justify-center gap-3.5 sm:gap-5 md:gap-6 scale-[0.76] sm:scale-[0.84] md:scale-[0.92] lg:scale-100 shrink-0 select-none [transform-style:preserve-3d] -ml-4 sm:-ml-8 md:-ml-12 lg:-ml-16"
                style={{
                    transform:
                        'rotateX(12deg) rotateY(-5deg) rotateZ(10deg)',
                }}
            >
                {/* Column 1 - Downwards */}
                <Marquee 
                    vertical 
                    pauseOnHover={false} 
                    repeat={trackCount <= 6 ? 4 : 3}
                    style={{ '--duration': dur1 } as React.CSSProperties}
                    className="shrink-0"
                    animationDelay="-12s"
                >
                    {col1.map((testimonial, i) => (
                        <SocialCommentCard key={`c1-${testimonial.id}-${i}`} testimonial={testimonial} />
                    ))}
                </Marquee>

                {/* Column 2 - Upwards (Reverse) */}
                <Marquee 
                    vertical 
                    reverse 
                    pauseOnHover={false} 
                    repeat={trackCount <= 6 ? 4 : 3}
                    style={{ '--duration': dur2 } as React.CSSProperties}
                    className="shrink-0"
                    animationDelay="-26s"
                >
                    {col2.map((testimonial, i) => (
                        <SocialCommentCard key={`c2-${testimonial.id}-${i}`} testimonial={testimonial} />
                    ))}
                </Marquee>

                {/* Column 3 - Downwards */}
                <Marquee 
                    vertical 
                    pauseOnHover={false} 
                    repeat={trackCount <= 6 ? 4 : 3}
                    style={{ '--duration': dur3 } as React.CSSProperties}
                    className="shrink-0"
                    animationDelay="-18s"
                >
                    {col3.map((testimonial, i) => (
                        <SocialCommentCard key={`c3-${testimonial.id}-${i}`} testimonial={testimonial} />
                    ))}
                </Marquee>

                {/* Column 4 - Upwards (Reverse) */}
                <Marquee 
                    vertical 
                    reverse 
                    pauseOnHover={false} 
                    repeat={trackCount <= 6 ? 4 : 3}
                    style={{ '--duration': dur4 } as React.CSSProperties}
                    className="shrink-0 hidden sm:flex"
                    animationDelay="-32s"
                >
                    {col4.map((testimonial, i) => (
                        <SocialCommentCard key={`c4-${testimonial.id}-${i}`} testimonial={testimonial} />
                    ))}
                </Marquee>

                {/* Column 5 - Downwards */}
                <Marquee 
                    vertical 
                    pauseOnHover={false} 
                    repeat={trackCount <= 6 ? 4 : 3}
                    style={{ '--duration': dur5 } as React.CSSProperties}
                    className="shrink-0 hidden lg:flex"
                    animationDelay="-8s"
                >
                    {col5.map((testimonial, i) => (
                        <SocialCommentCard key={`c5-${testimonial.id}-${i}`} testimonial={testimonial} />
                    ))}
                </Marquee>
            </div>
        </div>
      </section>
    </div>
  );
};

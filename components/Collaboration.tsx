
import React from 'react';
import { SectionWrapper } from './ui/SectionWrapper';
import { MagneticButton } from './ui/MagneticButton';
import { motion } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import { ArrowRight } from 'lucide-react';
import { Marquee } from './ui/3d-testimonails';
import { SocialCommentCard } from './SocialCommentCard';

export const Collaboration: React.FC = () => {
  const { aboutData } = useContent();
  const { subtitle, description, portrait, testimonials, testimonialsBackground } = aboutData;
  
  // Generate randomized column tracks ensuring every testimonial is included,
  // but randomized rather than displayed in backend sequential order.
  const { col1, col2, col3, col4, col5, trackCount } = React.useMemo(() => {
    if (!testimonials || testimonials.length === 0) {
      return { col1: [], col2: [], col3: [], col4: [], col5: [], trackCount: 0 };
    }

    const n = testimonials.length;

    // Helper: Generate a unique pseudo-random shuffle for a given column
    const createShuffledColumn = (colIndex: number) => {
      const items = [...testimonials];

      // Use a deterministic seed per column based on column index and testimonial IDs
      // so the shuffle is well-scrambled, unique per column, but stable across minor re-renders
      let seed = (colIndex + 1) * 7919;
      for (let i = 0; i < n; i++) {
        const idStr = items[i].id || '';
        for (let c = 0; c < idStr.length; c++) {
          seed = (seed + idStr.charCodeAt(c) * (c + 1)) % 1000003;
        }
      }

      const prng = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };

      // Fisher-Yates shuffle
      for (let i = items.length - 1; i > 0; i--) {
        const j = Math.floor(prng() * (i + 1));
        [items[i], items[j]] = [items[j], items[i]];
      }

      // Ensure that if there are fewer than 6 cards, repeat so the vertical marquee never has blank gaps
      let fullTrack = [...items];
      while (fullTrack.length < 6) {
        fullTrack = [...fullTrack, ...items];
      }

      return fullTrack;
    };

    const c1 = createShuffledColumn(0);
    const c2 = createShuffledColumn(1);
    const c3 = createShuffledColumn(2);
    const c4 = createShuffledColumn(3);
    const c5 = createShuffledColumn(4);

    return {
      col1: c1,
      col2: c2,
      col3: c3,
      col4: c4,
      col5: c5,
      trackCount: c1.length,
    };
  }, [testimonials]);

  // Dynamically compute scroll duration based on the number of items so the scroll pace remains steady and comfortable
  const baseDuration = Math.max(36, Math.round(trackCount * 4.8));
  const dur1 = `${baseDuration}s`;
  const dur2 = `${Math.round(baseDuration * 1.16)}s`;
  const dur3 = `${Math.round(baseDuration * 1.05)}s`;
  const dur4 = `${Math.round(baseDuration * 1.2)}s`;
  const dur5 = `${Math.round(baseDuration * 1.1)}s`;

  // Optimize image size function
  const getOptimizedBg = (url?: string) => {
    if(!url) return "";
    // If it's unsplash, try to resize it. Otherwise return original.
    if(url.includes("images.unsplash.com")) {
        // Replace existing w parameter or append new one. 
        // 1200px width with 60 quality is a good balance for background blur
        if(url.includes("?")) {
            return `${url}&w=1200&q=60`;
        }
        return `${url}?w=1200&q=60`;
    }
    return url;
  };

  return (
    <div className="bg-[#050505]">
      {/* Bio Section - Distinct ID for snapping */}
      <SectionWrapper id="about" className="!pb-10 md:!pb-14 relative overflow-hidden">
        {/* Subtle white atmosphere */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        
        {/* Responsive Layout: Stack on mobile, Side-by-Side on Desktop */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16 lg:gap-24">
            
            {/* Portrait Column */}
            <div className="w-full max-w-sm md:max-w-none md:w-[45%] lg:w-[40%] flex-shrink-0 relative order-1 md:order-1">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative z-10 w-full shadow-2xl"
                >
                    <div className="relative aspect-[3/4.2] md:aspect-[3/4] rounded-[2rem] md:rounded-[4rem] overflow-hidden border border-white/10 group">
                        <img 
                            src={portrait} 
                            alt="Liam Leslie" 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                        />
                        {/* Grain removed from here */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90"></div>
                        
                        {/* Caption Overlay */}
                        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20 max-w-[85%]">
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                viewport={{ once: true }}
                                className="glass-panel px-5 py-4 md:px-8 md:py-6 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl"
                            >
                                <p className="text-white font-black text-xl md:text-3xl lg:text-4xl tracking-tight mb-2 leading-none">Liam Leslie</p>
                                <div className="flex items-center gap-2 md:gap-3">
                                    <p className="text-white/90 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em]">Creative Director</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                    <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/[0.03] rounded-full blur-[50px] md:blur-[100px] pointer-events-none"></div>
                </motion.div>
            </div>

            {/* Content Column */}
            <div className="flex-1 flex flex-col justify-center text-left order-2 md:order-2">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-6 md:space-y-12"
                >
                    <div>
                        <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.4em] text-white/40 block mb-2 md:mb-4">{subtitle}</span>
                        <h2 className="text-4xl sm:text-5xl md:text-[clamp(1.1rem,5vw,6rem)] font-black text-white leading-[0.95] tracking-tighter">
                            Visualizing <br className="hidden md:block" />
                            <span className="text-white italic lowercase tracking-tight">the unseen.</span>
                        </h2>
                    </div>

                    <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-400 font-light leading-relaxed tracking-tight max-w-xl whitespace-pre-wrap">
                        {description}
                    </p>

                    <div className="pt-2 md:pt-6 flex flex-col sm:flex-row gap-5 md:gap-10 items-start sm:items-center">
                        <MagneticButton variant="primary" className="!w-full sm:!w-auto !px-8 md:!px-14 !py-4 md:!py-5 !text-xs md:!text-sm !font-black uppercase tracking-widest shadow-xl justify-center">
                            Connect
                        </MagneticButton>
                        <button className="flex items-center gap-2 md:gap-4 text-white font-black tracking-[0.2em] md:tracking-[0.3em] uppercase text-[10px] md:text-[11px] group">
                            Our Story <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-white/40 group-hover:translate-x-3 transition-transform duration-500" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
      </SectionWrapper>

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

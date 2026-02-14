
import React, { useState, useRef, useEffect } from 'react';
import { SectionWrapper } from './ui/SectionWrapper';
import { useContent } from '../context/ContentContext';
import { motion } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

export const Shorts: React.FC = () => {
  const { shorts } = useContent();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const activePlayerRef = useRef<any>(null);
  const containerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const getVideoId = (urlOrId: string) => {
    if (!urlOrId) return '';
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?v=)|(shorts\/))([^#&?]*).*/;
    const match = urlOrId.match(regExp);
    return match?.[8]?.length === 11 ? match[8] : urlOrId;
  };

  const handleClick = (short: any) => {
    setPlayingId(short.id);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const cardWidth = clientWidth / (window.innerWidth >= 768 ? 2 : 1);
      const scrollTo = direction === 'left' ? scrollLeft - cardWidth : scrollLeft + cardWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    let interval: any;

    if (activePlayerRef.current) {
      try {
        activePlayerRef.current.destroy();
      } catch (e) {
        console.error(e);
      }
      activePlayerRef.current = null;
    }

    if (playingId) {
      const currentShort = shorts.find((s) => s.id === playingId);
      const container = containerRefs.current[playingId];
      const videoId = getVideoId(currentShort?.videoId || '');

      if (container && videoId) {
        const initPlayer = () => {
          if (!window.YT || !window.YT.Player) return false;

          activePlayerRef.current = new window.YT.Player(container, {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: {
              autoplay: 1,
              controls: 1,
              rel: 0,
              modestbranding: 1,
              playsinline: 1,
              loop: 1,
              playlist: videoId,
            },
            events: {
              onReady: (e: any) => e.target.playVideo(),
            },
          });
          return true;
        };

        if (!initPlayer()) {
          interval = setInterval(() => {
            if (initPlayer()) clearInterval(interval);
          }, 100);
        }
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [playingId, shorts]);

  const displayShorts = shorts.slice(0, 10);

  return (
    <SectionWrapper id="shorts" className="bg-soft-black/50 overflow-visible">
      <div className="mb-8 md:mb-16 text-left md:text-center max-w-3xl mx-auto">
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-white mb-3 md:mb-4">Scroll Stopping Shorts</h2>
        <p className="text-gray-400 font-medium text-sm md:text-xl tracking-tight">Crafting high-impact narratives for the vertical format.</p>
      </div>

      <div className="relative">
        {/* Slider Container */}
        <div 
          ref={scrollRef}
          className="flex lg:grid lg:grid-cols-4 gap-4 md:gap-8 overflow-x-auto lg:overflow-x-visible scrollbar-hide snap-x snap-mandatory lg:snap-none pb-4 -mx-6 px-6 md:mx-0 md:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {displayShorts.map((short, index) => {
            const isPlaying = playingId === short.id;

            return (
              <motion.div
                key={short.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-[70vw] sm:w-[45vw] md:w-[calc(50%-1.25rem)] lg:w-auto snap-center group relative aspect-[9/16] rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer isolate border border-white/5 shadow-2xl"
                onClick={() => handleClick(short)}
              >
                {!isPlaying ? (
                  <div className="absolute inset-0 w-full h-full">
                    <img
                      src={short.image}
                      alt={short.title}
                      className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 transform group-hover:scale-105"
                    />

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 transform scale-50 group-hover:scale-100 transition-transform duration-500">
                        <Play size={24} className="text-white fill-current ml-1 md:w-7 md:h-7" />
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />

                    <div className="absolute inset-x-3 bottom-4 md:inset-x-5 md:bottom-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <div className="glass-panel p-4 md:p-5 rounded-xl md:rounded-2xl border border-white/10 backdrop-blur-2xl bg-black/40">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                          <h4 className="font-black text-white text-xs uppercase tracking-tight truncate">
                            {short.title}
                          </h4>
                        </div>
                        <div className="flex items-center justify-between text-[8px] md:text-[9px] uppercase tracking-widest text-gray-500 font-black">
                          <span>Story</span>
                          {short.showViews !== false && short.views !== 'Synced' && (
                             <span className="text-white/60">{short.views} VIEWS</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    ref={(el) => {
                      containerRefs.current[short.id] = el;
                    }}
                    className="w-full h-full bg-black"
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Navigation Row - Underneath on Mobile/Tablet */}
        <div className="flex lg:hidden items-center justify-center gap-8 mt-6 md:mt-10">
           <button 
              onClick={() => scroll('left')} 
              className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all active:scale-90"
              aria-label="Previous Short"
           >
              <ChevronLeft size={24} className="md:w-7 md:h-7" />
           </button>
           <div className="h-[1px] w-12 md:w-16 bg-white/10"></div>
           <button 
              onClick={() => scroll('right')} 
              className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-all active:scale-90"
              aria-label="Next Short"
           >
              <ChevronRight size={24} className="md:w-7 md:h-7" />
           </button>
        </div>
      </div>
    </SectionWrapper>
  );
};

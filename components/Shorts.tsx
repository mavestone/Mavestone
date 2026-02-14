
import React, { useState, useRef, useEffect } from 'react';
import { SectionWrapper } from './ui/SectionWrapper';
import { useContent } from '../context/ContentContext';
import { motion } from 'framer-motion';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

export const Shorts: React.FC = () => {
  const { shorts } = useContent();
  const [playingId, setPlayingId] = useState<string | null>(null);
  const activePlayerRef = useRef<any>(null);
  const containerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const getVideoId = (urlOrId: string) => {
    if (!urlOrId) return '';
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?v=)|(shorts\/))([^#&?]*).*/;
    const match = urlOrId.match(regExp);
    return match?.[8]?.length === 11 ? match[8] : urlOrId;
  };

  const handleClick = (short: any) => {
    if (playingId === short.id) return; 
    setPlayingId(short.id);
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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
        const { scrollLeft, clientWidth } = scrollContainerRef.current;
        const offset = direction === 'left' ? -clientWidth / 2 : clientWidth / 2;
        scrollContainerRef.current.scrollTo({ left: scrollLeft + offset, behavior: 'smooth' });
    }
  };

  return (
    <SectionWrapper id="shorts" className="bg-soft-black/50">
      <div className="mb-8 md:mb-16 text-left md:text-center max-w-3xl mx-auto px-4">
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-white mb-3 md:mb-4">Scroll Stopping Shorts</h2>
        <p className="text-gray-400 font-medium text-sm md:text-xl tracking-tight">Crafting high-impact narratives for the vertical format.</p>
      </div>

      <div className="relative group">
         {/* Navigation Buttons */}
         <button 
            onClick={() => scroll('left')}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
         >
            <ChevronLeft size={24} />
         </button>
         <button 
            onClick={() => scroll('right')}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-black/50 hover:bg-black/80 text-white p-3 rounded-full backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block"
         >
            <ChevronRight size={24} />
         </button>

         {/* Horizontal Scroll Container */}
         <div 
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-8 px-4 md:px-12 scrollbar-hide snap-x snap-mandatory overflow-y-hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
         >
            {shorts.map((short, index) => {
                const isPlaying = playingId === short.id;

                return (
                  <motion.div
                    key={short.id}
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex-shrink-0 w-[260px] md:w-[320px] aspect-[9/16] relative rounded-2xl md:rounded-3xl overflow-hidden cursor-pointer isolate border border-white/5 shadow-2xl bg-black snap-center"
                    onClick={() => handleClick(short)}
                  >
                    {!isPlaying ? (
                      <div className="absolute inset-0 w-full h-full overflow-hidden">
                        <img
                          src={short.image}
                          alt={short.title}
                          draggable={false}
                          className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 transform hover:scale-105 select-none"
                        />

                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-all duration-500">
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 transform scale-50 hover:scale-100 transition-transform duration-500">
                            <Play size={24} className="text-white fill-current ml-1 md:w-7 md:h-7" />
                          </div>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none" />

                        <div className="absolute inset-x-3 bottom-4 md:inset-x-5 md:bottom-6">
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
                      <div className="w-full h-full bg-black overflow-hidden relative">
                         <div
                            ref={(el) => {
                              containerRefs.current[short.id] = el;
                            }}
                            className="w-full h-full"
                          />
                      </div>
                    )}
                  </motion.div>
                );
            })}
         </div>
      </div>
    </SectionWrapper>
  );
};

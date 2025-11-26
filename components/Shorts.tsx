
import React, { useState, useRef, useEffect } from 'react';
import { SectionWrapper } from './ui/SectionWrapper';
import { useContent } from '../context/ContentContext';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export const Shorts: React.FC = () => {
  const { shorts } = useContent();
  const [playingId, setPlayingId] = useState<string | null>(null);
  
  // Ref to hold the active player instance
  const activePlayerRef = useRef<any>(null);
  // Refs for container elements
  const containerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const getVideoId = (urlOrId: string) => {
    if (!urlOrId) return '';
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?v=)|(shorts\/))([^#&?]*).*/;
    const match = urlOrId.match(regExp);
    // Safer check using optional chaining
    return match?.[8]?.length === 11 ? match[8] : urlOrId;
  };

  // 1. Inject YouTube Script if missing
  useEffect(() => {
    if (!window.YT) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    let interval: any;

    // Cleanup previous player if exists
    if (activePlayerRef.current) {
        try {
            activePlayerRef.current.destroy();
        } catch(e) { console.error(e); }
        activePlayerRef.current = null;
    }

    if (playingId) {
        const currentShort = shorts.find(s => s.id === playingId);
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
                        playlist: videoId, // Required for loop
                        // Origin removed to prevent Error 153
                    },
                    events: {
                        onReady: (e: any) => e.target.playVideo()
                    }
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

  // Global unmount cleanup
  useEffect(() => {
      return () => {
          if (activePlayerRef.current) {
              try {
                activePlayerRef.current.destroy();
              } catch(e) {}
          }
      };
  }, []);

  return (
    <SectionWrapper id="shorts" className="bg-soft-black/50">
      <div className="mb-16 text-left md:text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-4">Short Stories. Big Impact.</h2>
        <p className="text-gray-400">Designed for now. Built to last.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {shorts.map((short, index) => {
           const isPlaying = playingId === short.id;

           return (
          <motion.div
            key={short.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            viewport={{ once: true }}
            className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-charcoal cursor-none isolate"
          >
             {!isPlaying ? (
                 <div 
                    className="absolute inset-0 cursor-pointer"
                    onClick={() => setPlayingId(short.id)}
                 >
                    <img
                        src={short.image}
                        alt={short.title}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-all duration-500 transform group-hover:scale-105"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
                    
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Play size={20} fill="currentColor" className="ml-1 text-white" />
                        </div>
                    </div>

                    <div className="absolute bottom-0 left-0 p-6 w-full pointer-events-none">
                        <div className="flex justify-between items-end">
                            <div>
                                <h3 className="text-lg font-bold text-white leading-tight">{short.title}</h3>
                                <p className="text-xs text-gray-400 mt-1">Short Film</p>
                            </div>
                            <span className="text-xs font-mono text-white/60 bg-white/10 px-2 py-1 rounded-md backdrop-blur-sm">
                                {short.views}
                            </span>
                        </div>
                    </div>
                 </div>
             ) : (
                 <div 
                    ref={el => { containerRefs.current[short.id] = el; }} 
                    className="w-full h-full bg-black" 
                 />
             )}
          </motion.div>
        )})}
      </div>
    </SectionWrapper>
  );
};

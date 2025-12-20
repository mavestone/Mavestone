
import React, { useState, useRef, useEffect } from 'react';
import { SectionWrapper } from './ui/SectionWrapper';
import { useContent } from '../context/ContentContext';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

export const Shorts: React.FC = () => {
  const { shorts } = useContent();
  const [playingId, setPlayingId] = useState<string | null>(null);
  
  // Ref to hold the active YouTube player instance
  const activePlayerRef = useRef<any>(null);
  // Refs for container elements
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

  // YouTube logic
  useEffect(() => {
    let interval: any;

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
                        playlist: videoId,
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

  return (
    <SectionWrapper id="shorts" className="bg-soft-black/50">
      <div className="mb-16 text-left md:text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-4">Short Stories. Big Impact.</h2>
        <p className="text-gray-400">Cinematic vertical narratives designed for the mobile era.</p>
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
            className="group relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer isolate border border-white/5 shadow-2xl"
            onClick={() => handleClick(short)}
          >
             {!isPlaying ? (
                 <div className="absolute inset-0 w-full h-full">
                    {/* Background Image */}
                    <img
                        src={short.image}
                        alt={short.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-110"
                    />
                    
                    {/* Play Icon Center */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                            <Play size={24} className="text-white fill-current ml-1" />
                        </div>
                    </div>

                    {/* Gradients */}
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />

                    {/* Floating Glass Content */}
                    <div className="absolute inset-x-4 bottom-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="glass-panel p-4 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 group-hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-2 mb-1">
                                <Play size={10} className="text-red-500 fill-current" />
                                <h4 className="font-bold text-white text-sm leading-tight truncate">{short.title}</h4>
                            </div>
                            <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-gray-400">
                                <span>YouTube Short</span>
                                {short.showViews !== false && short.views !== "Synced" && short.views !== "New" && (
                                    <span className="flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                        {short.views}
                                    </span>
                                )}
                            </div>
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

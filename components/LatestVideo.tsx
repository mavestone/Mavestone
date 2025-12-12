
import React, { useState, useRef, useEffect } from 'react';
import { SectionWrapper } from './ui/SectionWrapper';
import { useContent } from '../context/ContentContext';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const LatestVideo: React.FC = () => {
  const { latestVideo } = useContent();
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  // Helper to extract ID safely
  const getVideoId = (urlOrId: string) => {
    if (!urlOrId) return '';
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?v=)|(shorts\/))([^#&?]*).*/;
    const match = urlOrId.match(regExp);
    // Safer check using optional chaining
    return match?.[8]?.length === 11 ? match[8] : urlOrId;
  };

  const videoId = getVideoId(latestVideo.videoId);

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

    if (isPlaying && videoId && containerRef.current) {
      const initPlayer = () => {
        // Double check API is ready
        if (!window.YT || !window.YT.Player) return false;

        playerRef.current = new window.YT.Player(containerRef.current, {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            // Origin removed to prevent Error 153
          },
          events: {
            onReady: (event: any) => {
              event.target.playVideo();
            },
          },
        });
        return true;
      };

      // Try to init immediately, if fails, poll briefly until script loads
      if (!initPlayer()) {
        interval = setInterval(() => {
          if (initPlayer()) {
            clearInterval(interval);
          }
        }, 100);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          console.error("Error destroying player", e);
        }
        playerRef.current = null;
      }
    };
  }, [isPlaying, videoId]);

  return (
    <SectionWrapper id="work">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 text-left w-full relative z-10">
        <div className="items-start text-left max-w-xl">
           <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mb-2">Latest Film</h2>
           <p className="text-gray-400">A glimpse into our newest story.</p>
        </div>
        <div className="mt-8 md:mt-0 flex-shrink-0">
            <Link to="/projects" className="inline-block text-xs md:text-sm font-bold uppercase tracking-widest text-white hover:text-gray-300 transition-colors border-b border-white/30 hover:border-white pb-1">
                View All Projects
            </Link>
        </div>
      </div>

      <div className="w-full aspect-video rounded-3xl overflow-hidden bg-black shadow-2xl relative isolate">
        {!isPlaying ? (
            /* THUMBNAIL STATE */
            <div 
                className="relative w-full h-full cursor-pointer group"
                onClick={() => setIsPlaying(true)}
            >
                <img 
                    src={latestVideo.image} 
                    alt={latestVideo.title} 
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-all duration-500"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className="w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-black transition-all duration-300"
                    >
                        <Play className="ml-1 w-8 h-8 md:w-10 md:h-10 fill-current" />
                    </motion.div>
                </div>
                
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 bg-gradient-to-t from-black/90 to-transparent pointer-events-none text-left">
                    <h3 className="text-2xl md:text-4xl font-bold text-white mb-2">{latestVideo.title}</h3>
                    <p className="text-gray-300 max-w-lg text-sm md:text-base">{latestVideo.description}</p>
                </div>
            </div>
        ) : (
            /* PLAYER CONTAINER - The YouTube API replaces this div with the iframe */
            <div ref={containerRef} className="w-full h-full" />
        )}
      </div>
    </SectionWrapper>
  );
};


import React, { useState, useRef, useEffect } from 'react';
import { SectionWrapper } from './ui/SectionWrapper';
import { useContent } from '../context/ContentContext';
import { Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LatestVideo: React.FC = () => {
  const { latestVideo } = useContent();
  const [isPlaying, setIsPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  const getVideoId = (urlOrId: string) => {
    if (!urlOrId) return '';
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?v=)|(shorts\/))([^#&?]*).*/;
    const match = urlOrId.match(regExp);
    return match?.[8]?.length === 11 ? match[8] : urlOrId;
  };

  const videoId = getVideoId(latestVideo.videoId);

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
          },
          events: {
            onReady: (event: any) => {
              event.target.playVideo();
            },
          },
        });
        return true;
      };

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12 text-left w-full relative z-10">
        <div className="items-start text-left max-w-xl">
           <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-white mb-2">Latest Film</h2>
           <p className="text-gray-400 font-medium text-sm md:text-base">A glimpse into our newest cinematic story.</p>
        </div>
        <div className="mt-6 md:mt-0 flex-shrink-0">
            <Link 
                to="/projects" 
                className="group flex items-center gap-2 px-6 py-2.5 md:px-8 md:py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
                <span>View Full Portfolio</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-white" />
            </Link>
        </div>
      </div>

      <div className="w-full aspect-video rounded-2xl md:rounded-3xl overflow-hidden bg-black shadow-2xl relative isolate border border-white/5">
        {!isPlaying ? (
            <div 
                className="relative w-full h-full cursor-pointer group overflow-hidden"
                onClick={() => setIsPlaying(true)}
            >
                <img 
                    src={latestVideo.image} 
                    alt={latestVideo.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale-[20%] group-hover:grayscale-0"
                />
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-white text-black rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.3)] transform scale-50 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500 ease-out delay-100 hover:scale-110">
                        <Play className="ml-1 w-6 h-6 md:w-10 md:h-10 fill-current" />
                    </div>

                    <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-auto md:max-w-xl transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out delay-200">
                         <div className="glass-panel p-5 md:p-8 rounded-2xl border border-white/10 backdrop-blur-xl bg-black/60 text-left shadow-2xl">
                            <h3 className="text-xl md:text-3xl font-black text-white mb-2 leading-tight tracking-tight">{latestVideo.title}</h3>
                            <p className="text-gray-300 text-xs md:text-sm md:text-base leading-relaxed font-light line-clamp-3">{latestVideo.description}</p>
                         </div>
                    </div>
                </div>
            </div>
        ) : (
            <div ref={containerRef} className="w-full h-full" />
        )}
      </div>
    </SectionWrapper>
  );
};

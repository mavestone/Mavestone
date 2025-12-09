
import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play, Info, Plus } from 'lucide-react';

interface ProjectCarouselProps {
  title: string;
  items: any[];
  type: 'film' | 'short' | 'coming-soon';
  onPlay?: (item: any) => void;
  onMoreInfo?: (item: any) => void;
}

export const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ title, items, type, onPlay, onMoreInfo }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);

  const handleClick = (direction: 'left' | 'right') => {
    setIsMoved(true);
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth / 2 
        : scrollLeft + clientWidth / 2;
      
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const getAspectRatio = () => {
      switch(type) {
          case 'short': return 'aspect-[9/16] w-[160px] md:w-[220px]';
          case 'coming-soon': return 'aspect-[21/9] w-[300px] md:w-[450px]';
          default: return 'aspect-video w-[260px] md:w-[340px]';
      }
  };

  return (
    <div className="space-y-2 py-4 group/row relative z-20 w-full overflow-hidden">
      <h2 className="text-xl md:text-2xl font-semibold text-white px-6 md:px-12 group-hover/row:text-white transition-colors duration-300 shadow-black drop-shadow-md mb-2">
          {title}
      </h2>

      <div className="group relative w-full">
        {/* Left Arrow */}
        <div 
            className={`absolute top-1/2 -translate-y-1/2 left-4 z-40 w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-xl ${!isMoved ? 'hidden' : 'opacity-0 group-hover:opacity-100'}`}
            onClick={() => handleClick('left')}
        >
            <ChevronLeft className="w-6 h-6 text-white" />
        </div>

        {/* Scroll Container - Edge to Edge (No Right Padding) */}
        <div 
            ref={rowRef}
            className="flex items-center gap-4 overflow-x-scroll scrollbar-hide pl-6 md:pl-12 pr-0 py-8 scroll-smooth w-full"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <div 
                key={item.id || item.title} 
                className={`relative flex-none ${getAspectRatio()} transition-all duration-300 ease-in-out hover:z-30 hover:scale-110 origin-center`}
                onClick={() => type === 'short' && onPlay && onPlay(item)}
            >
                <div className="w-full h-full rounded-2xl overflow-hidden bg-white/5 border border-white/10 relative shadow-lg group/card cursor-pointer">
                    <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                    />
                    
                    {/* TYPE: SHORT (Bottom Floating Glass Panel Style) */}
                    {type === 'short' ? (
                       <>
                           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
                           <div className="absolute inset-x-2 bottom-4 translate-y-2 group-hover/card:translate-y-0 transition-transform duration-500">
                                <div className="glass-panel p-3 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 group-hover/card:bg-white/10 transition-colors">
                                    <h4 className="font-bold text-white text-sm leading-tight mb-1">{item.title}</h4>
                                    <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-gray-300">
                                        <span>{item.category || "Short Film"}</span>
                                        {item.showViews !== false && (
                                            <span className="flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                                {item.views}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                       </>
                    ) : (
                        /* TYPE: FILM (Full Overlay Style) */
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex flex-col justify-between p-5 border-[3px] border-white/10 rounded-2xl">
                             <div className="flex justify-between items-start">
                                <h3 className="text-base font-bold text-white line-clamp-2 drop-shadow-lg">{item.title}</h3>
                            </div>
                            
                            <div className="space-y-3 mt-auto">
                                <div className="flex items-center gap-3">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onPlay && onPlay(item); }}
                                        className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 hover:scale-110 transition-all shadow-lg shadow-white/10"
                                    >
                                        <Play size={16} fill="currentColor" />
                                    </button>
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); onMoreInfo && onMoreInfo(item); }}
                                        className="w-10 h-10 rounded-full border-2 border-gray-400 text-white flex items-center justify-center hover:border-white hover:bg-white/10 ml-auto transition-colors"
                                    >
                                        <Info size={18} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 text-[10px] text-gray-200 font-medium flex-wrap">
                                    <span className="text-green-400 font-bold">{item.match || "90% Match"}</span>
                                    {item.maturityRating && <span className="border border-gray-500 px-1">{item.maturityRating}</span>}
                                    {item.duration && <span>{item.duration}</span>}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <div 
            className="absolute top-1/2 -translate-y-1/2 right-4 z-40 w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl"
            onClick={() => handleClick('right')}
        >
            <ChevronRight className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
};

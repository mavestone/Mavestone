
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Info, Plus } from 'lucide-react';

interface CarouselItem {
  id: string;
  title: string;
  image: string;
  category?: string;
  description?: string;
  views?: string;
  status?: string;
}

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
    <div className="space-y-4 py-8 group/row">
      <h2 className="text-xl md:text-2xl font-semibold text-white px-6 md:px-12 group-hover/row:text-white transition-colors duration-300">
          {title}
      </h2>

      <div className="group relative md:-ml-2">
        {/* Left Arrow */}
        <div 
            className={`absolute top-0 bottom-0 left-0 z-40 w-12 bg-black/50 backdrop-blur-sm flex items-center justify-center cursor-pointer transition-opacity duration-300 ${!isMoved ? 'hidden' : 'opacity-0 group-hover:opacity-100 hover:bg-black/70'}`}
            onClick={() => handleClick('left')}
        >
            <ChevronLeft className="w-8 h-8 text-white" />
        </div>

        {/* Scroll Container */}
        <div 
            ref={rowRef}
            className="flex items-center gap-4 overflow-x-scroll scrollbar-hide px-6 md:px-12 pb-8 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <div 
                key={item.id || item.title} 
                className={`relative flex-none ${getAspectRatio()} transition-all duration-300 ease-in-out hover:z-30 hover:scale-110 origin-center`}
            >
                <div className="w-full h-full rounded-md overflow-hidden bg-white/5 border border-white/10 relative shadow-lg group/card cursor-pointer">
                    <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                    />
                    
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-black/20 group-hover/card:bg-black/0 transition-colors" />

                    {/* Hover Content */}
                    <div className="absolute inset-0 bg-black/80 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                        <div className="flex justify-between items-start">
                             <h3 className="text-sm font-bold text-white line-clamp-2">{item.title}</h3>
                        </div>
                        
                        <div className="space-y-2">
                            {type === 'coming-soon' && item.status && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block">
                                    {item.status}
                                </span>
                            )}
                            
                            <div className="flex items-center gap-2">
                                <button 
                                    onClick={() => onPlay && onPlay(item)}
                                    className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:bg-gray-200 transition-colors"
                                >
                                    <Play size={12} fill="currentColor" />
                                </button>
                                <button className="w-8 h-8 rounded-full border border-gray-400 text-white flex items-center justify-center hover:border-white transition-colors">
                                    <Plus size={14} />
                                </button>
                                <button 
                                    onClick={() => onMoreInfo && onMoreInfo(item)}
                                    className="w-8 h-8 rounded-full border border-gray-400 text-white flex items-center justify-center hover:border-white ml-auto transition-colors"
                                >
                                    <Info size={14} />
                                </button>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-gray-300 font-medium">
                                {item.category && <span>{item.category}</span>}
                                {item.views && <span className="text-green-400">{item.views} views</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <div 
            className="absolute top-0 bottom-0 right-0 z-40 w-12 bg-black/50 backdrop-blur-sm flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-black/70 transition-opacity duration-300"
            onClick={() => handleClick('right')}
        >
            <ChevronRight className="w-8 h-8 text-white" />
        </div>
      </div>
    </div>
  );
};

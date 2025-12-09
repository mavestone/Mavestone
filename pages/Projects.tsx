
import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useContent } from '../context/ContentContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, X } from 'lucide-react';
import { ProjectCarousel } from '../components/ui/ProjectCarousel';

export const Projects: React.FC = () => {
  const { films, shorts, inProduction } = useContent();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<any>(null); // For details modal
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState(false); // For fullscreen player
  
  // Use the first film as the featured hero
  const featured = films[0] || { 
      title: "Mavestone", 
      tagline: "Stories that move people", 
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2500&auto=format&fit=crop",
      category: "Featured Film",
      description: "We blend cinematic visuals with strategic storytelling to build brands that leave a legacy. Every frame feels intentional.",
      videoId: "jfopjfSYLcM"
  };

  const heroVideoId = featured.videoId || "jfopjfSYLcM";

  // Handle Detail Modal
  const openDetails = (item: any) => {
      setActiveItem(item);
      setIsModalOpen(true);
  };

  const openPlayer = (item: any) => {
    setActiveItem(item);
    setIsVideoPlayerOpen(true);
  };

  // Prevent scrolling when modal is open
  useEffect(() => {
      if (isModalOpen || isVideoPlayerOpen) document.body.style.overflow = 'hidden';
      else document.body.style.overflow = 'unset';
  }, [isModalOpen, isVideoPlayerOpen]);

  return (
    <div className="bg-[#141414] min-h-screen text-white font-sans selection:bg-white/20 overflow-x-hidden">
      <Navbar />
      
      {/* Full Screen Video Player Modal */}
      <AnimatePresence>
        {isVideoPlayerOpen && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[200] bg-black flex items-center justify-center"
            >
                <button 
                    onClick={() => setIsVideoPlayerOpen(false)}
                    className="absolute top-8 right-8 z-[210] p-4 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors cursor-pointer"
                >
                    <X size={24} />
                </button>
                <div className="w-full h-full max-w-7xl max-h-[90vh] aspect-video">
                     <iframe 
                        width="100%" 
                        height="100%" 
                        src={`https://www.youtube.com/embed/${activeItem?.videoId || heroVideoId}?autoplay=1&rel=0&modestbranding=1`} 
                        title="YouTube video player" 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Info Details Modal (Lightbox) */}
      <AnimatePresence>
        {isModalOpen && activeItem && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 overflow-y-auto"
                onClick={() => setIsModalOpen(false)}
            >
                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className="relative w-full max-w-4xl bg-[#181818] rounded-2xl overflow-hidden shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="absolute top-4 right-4 z-20 p-2 bg-[#181818] rounded-full text-white hover:bg-white/20 transition-colors"
                    >
                        <X size={20} />
                    </button>

                    {/* Modal Hero */}
                    <div className="relative w-full aspect-video">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] to-transparent z-10" />
                        <img src={activeItem.image} alt={activeItem.title} className="w-full h-full object-cover" />
                        <div className="absolute bottom-0 left-0 p-8 z-20">
                            <h2 className="text-4xl font-bold mb-2">{activeItem.title}</h2>
                            <div className="flex items-center gap-3 text-sm font-bold text-gray-400 mb-4">
                                {activeItem.category && <span className="text-green-400">98% Match</span>}
                                <span>{activeItem.category || "Project"}</span>
                                {activeItem.status && <span className="px-2 py-0.5 border border-gray-500 rounded text-[10px]">{activeItem.status}</span>}
                            </div>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => { setIsModalOpen(false); openPlayer(activeItem); }}
                                    className="px-8 py-2 bg-white text-black font-bold rounded hover:bg-gray-200 transition-colors flex items-center gap-2"
                                >
                                    <Play size={18} fill="currentColor" /> Play
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Modal Details */}
                    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-4">
                            <div className="flex items-center gap-2 text-sm text-green-400 font-bold">
                                <span>New Release</span>
                                <span className="text-gray-400 font-normal">2024</span>
                            </div>
                            <p className="text-gray-300 leading-relaxed text-lg">
                                {activeItem.description || activeItem.tagline || "No description available for this project."}
                            </p>
                        </div>
                        <div className="space-y-4 text-sm text-gray-400">
                             <div>
                                <span className="text-gray-500">Genres:</span> <span className="text-white">Cinematic, Commercial, Storytelling</span>
                             </div>
                             <div>
                                <span className="text-gray-500">Maturity Rating:</span> <span className="border border-gray-500 px-1 text-xs text-white">TV-14</span>
                             </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <div className="relative w-full h-[85vh] overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 pointer-events-none">
             <iframe
                className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 opacity-60 grayscale-[20%]"
                src={`https://www.youtube.com/embed/${heroVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${heroVideoId}&playsinline=1&rel=0`}
                title="Hero Background"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
        </div>

        {/* Hero Content - Left Aligned Glass Panel */}
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center px-6 md:px-12 z-10">
            <div className="max-w-2xl mt-16 md:mt-0">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    {/* Glass Panel Container */}
                    <div className="glass-panel p-6 md:p-10 rounded-2xl border border-white/10 backdrop-blur-md bg-black/20 shadow-2xl">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-red-600 font-bold text-4xl md:text-5xl tracking-tighter">M</span>
                            <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Original</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-none tracking-tight">
                            {featured.title}
                        </h1>

                        <div className="flex items-center gap-4 text-sm font-bold text-gray-300 mb-6">
                            <span className="text-green-400">98% Match</span>
                            <span className="text-gray-400">{featured.category}</span>
                            <span className="border border-gray-500 px-1 text-xs">4K</span>
                        </div>

                        <p className="text-base md:text-lg text-white drop-shadow-md mb-8 line-clamp-3 font-medium">
                            {featured.description || featured.tagline}
                        </p>

                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => openPlayer(featured)}
                                className="px-6 md:px-8 py-2 md:py-3 bg-white text-black text-lg font-bold rounded hover:bg-white/90 transition-colors flex items-center gap-2"
                            >
                                <Play fill="currentColor" size={24} /> Play
                            </button>
                            <button 
                                onClick={() => openDetails(featured)}
                                className="px-6 md:px-8 py-2 md:py-3 bg-[rgba(109,109,110,0.7)] text-white text-lg font-bold rounded hover:bg-[rgba(109,109,110,0.4)] transition-colors flex items-center gap-2 backdrop-blur-sm"
                            >
                                <Info size={24} /> More Info
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
      </div>

      {/* CAROUSEL ROWS */}
      <div className="relative z-20 -mt-24 md:-mt-32 pb-24 space-y-12 overflow-hidden">
         {/* Row 1: Selected Works (Feature Films) */}
         <ProjectCarousel 
            title="Selected Works" 
            items={films} 
            type="film" 
            onPlay={openPlayer}
            onMoreInfo={openDetails}
         />

         {/* Row 2: Short Stories */}
         <ProjectCarousel 
            title="Short Stories" 
            items={shorts} 
            type="short" 
            onPlay={openPlayer}
            onMoreInfo={openDetails}
         />

         {/* Row 3: Coming Soon (Static Cinematic Card) */}
         <div className="px-6 md:px-12 py-4">
             <h2 className="text-xl md:text-2xl font-semibold text-white mb-4 shadow-black drop-shadow-md">
                 Coming Soon
             </h2>
             <div className="w-full relative aspect-[21/9] rounded-2xl overflow-hidden group border border-white/10">
                <img 
                    src={inProduction.image} 
                    alt={inProduction.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" 
                />
                
                {/* Floating Content Box - Bottom Left */}
                <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 max-w-lg z-20">
                    {/* Default State: Title only */}
                     <div className="transition-all duration-300 transform translate-y-8 group-hover:translate-y-0">
                        {inProduction.status && (
                            <span className="inline-block px-2 py-1 bg-red-600 text-white text-[10px] font-bold uppercase tracking-widest rounded mb-3 backdrop-blur-md shadow-lg">
                                {inProduction.status}
                            </span>
                        )}
                        <h3 className="text-3xl md:text-5xl font-bold text-white mb-3 drop-shadow-lg">{inProduction.title}</h3>
                        
                        {/* Hidden Description (Reveals on Hover) */}
                        <div className="h-0 overflow-hidden group-hover:h-auto opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                             <p className="text-sm md:text-base text-gray-200 leading-relaxed font-light drop-shadow-md bg-black/40 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                                {inProduction.description}
                            </p>
                        </div>
                     </div>
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
             </div>
         </div>
      </div>

      <Footer />
    </div>
  );
};

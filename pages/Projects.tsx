
import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useContent } from '../context/ContentContext';
import { motion } from 'framer-motion';
import { Play, Info, ArrowRight, Clapperboard } from 'lucide-react';

export const Projects: React.FC = () => {
  const { films, shorts, latestVideo, inProduction } = useContent();
  
  // Use the first film as the featured hero
  const featured = films[0] || { 
      title: "Cinematic Excellence", 
      tagline: "Stories that move people", 
      image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2500&auto=format&fit=crop",
      category: "Featured Film"
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-white/20 overflow-x-hidden">
      <Navbar />
      
      {/* Ambient Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      {/* Glass Hero Section */}
      <div className="relative h-[90vh] w-full flex items-center justify-center px-6 md:px-12 pt-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={featured.image} 
            alt={featured.title} 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-transparent" />
        </div>

        {/* Floating Glass Hero Card */}
        <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-7xl mx-auto"
        >
            <div className="glass-panel p-8 md:p-12 rounded-[2rem] max-w-2xl backdrop-blur-[40px] border border-white/10 relative overflow-hidden group">
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                
                <div className="flex items-center gap-3 mb-6">
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] uppercase tracking-widest font-medium backdrop-blur-md">
                        {featured.category}
                    </span>
                    <span className="w-12 h-[1px] bg-white/30" />
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4 text-glow text-white">
                    {featured.title}
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-300 font-light italic mb-10 leading-relaxed">
                    "{featured.tagline}"
                </p>

                <div className="flex flex-wrap items-center gap-4">
                    <button className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        <Play fill="currentColor" size={20} />
                        <span>Play Film</span>
                    </button>
                    <button className="flex items-center gap-3 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-colors backdrop-blur-md">
                        <Info size={20} />
                        <span>Details</span>
                    </button>
                </div>
            </div>
        </motion.div>
      </div>

      {/* Content Sections */}
      <div className="relative z-20 -mt-24 pb-32 space-y-24 px-6 md:px-12 max-w-[1920px] mx-auto">
        
        {/* Latest Release */}
        <div className="space-y-6">
             <div className="flex items-center justify-between px-2">
                 <h3 className="text-2xl font-light tracking-wide text-white/90">New Release</h3>
             </div>
             
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative w-full aspect-[21/9] md:aspect-[2.39/1] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl"
             >
                <img 
                    src={latestVideo.image} 
                    alt={latestVideo.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                
                {/* Glass Overlay on Hover */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                    <div className="glass-panel inline-block px-8 py-6 rounded-2xl backdrop-blur-xl border border-white/10 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <h4 className="font-bold text-3xl mb-2">{latestVideo.title}</h4>
                        <p className="text-gray-300 font-light max-w-md line-clamp-2">{latestVideo.description}</p>
                        <div className="mt-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                            <span>Watch Now</span>
                            <ArrowRight size={16} />
                        </div>
                    </div>
                </div>
             </motion.div>
        </div>

        {/* Coming Soon Section */}
        <div className="space-y-6">
            <h3 className="text-2xl font-light tracking-wide text-white/90 px-2 flex items-center gap-3">
                <Clapperboard size={20} className="text-gray-400" />
                Coming Soon
            </h3>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative w-full aspect-[21/9] rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl isolate"
            >
                 <img 
                    src={inProduction.image} 
                    alt={inProduction.title} 
                    className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-1000" 
                />
                <div className="absolute inset-0 bg-black/50" />
                
                {/* Bottom Left Content (Pop up on hover) */}
                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full flex items-end">
                    <div className="glass-panel inline-block p-6 md:p-8 rounded-2xl border border-white/10 backdrop-blur-xl text-left max-w-xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="inline-block px-3 py-1 mb-3 rounded-full bg-red-500/20 border border-red-500/30 text-red-400 text-[10px] font-bold uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                            {inProduction.status}
                        </div>
                        <h2 className="text-2xl md:text-4xl font-bold text-white mb-3 tracking-tight text-glow">
                            {inProduction.title}
                        </h2>
                        <p className="text-sm md:text-base text-gray-300 font-light leading-relaxed line-clamp-3">
                            {inProduction.description}
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>

        {/* Short Stories (Vertical Cards) */}
        <div className="space-y-6">
            <h3 className="text-2xl font-light tracking-wide text-white/90 px-2">Short Stories</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                {shorts.map((short, i) => (
                    <motion.div 
                        key={short.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="group relative aspect-[9/16] rounded-2xl overflow-hidden cursor-pointer"
                    >
                        {/* Background Image */}
                        <img 
                            src={short.image} 
                            alt={short.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        
                        {/* Full Card Glass Overlay */}
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />

                        {/* Floating Content */}
                        <div className="absolute inset-x-4 bottom-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <div className="glass-panel p-4 rounded-xl border border-white/10 backdrop-blur-md bg-white/5 group-hover:bg-white/10 transition-colors">
                                <h4 className="font-bold text-white text-lg leading-tight mb-1">{short.title}</h4>
                                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-gray-300">
                                    <span>Short Film</span>
                                    {short.showViews !== false && (
                                        <span className="flex items-center gap-1">
                                            <span className="w-1 h-1 rounded-full bg-green-500" />
                                            {short.views}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>

        {/* Feature Films (Horizontal Cards) */}
        <div className="space-y-6">
            <h3 className="text-2xl font-light tracking-wide text-white/90 px-2">Selected Works</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {films.map((film, i) => (
                    <motion.div 
                        key={film.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="group relative aspect-video rounded-2xl overflow-hidden cursor-pointer shadow-lg"
                    >
                        <img 
                            src={film.image} 
                            alt={film.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500" />
                        
                        {/* Center Play Icon */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                                <Play fill="currentColor" className="ml-1 text-white" />
                            </div>
                        </div>

                        {/* Bottom Info */}
                        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent">
                            <h4 className="text-xl font-bold text-white">{film.title}</h4>
                            <p className="text-sm text-gray-400 font-light">{film.category}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};

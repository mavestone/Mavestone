
import React from 'react';
import { SectionWrapper } from './ui/SectionWrapper';
import { MagneticButton } from './ui/MagneticButton';
import { motion } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import { Quote, ArrowRight } from 'lucide-react';

export const Collaboration: React.FC = () => {
  const { aboutData } = useContent();
  const { subtitle, description, portrait, testimonials, testimonialsBackground } = aboutData;
  
  // Create a quadrupled array to ensure smooth infinite looping on large screens
  const marqueeItems = [...testimonials, ...testimonials, ...testimonials, ...testimonials];

  // Optimize image size function
  const getOptimizedBg = (url?: string) => {
    if(!url) return "";
    // If it's unsplash, try to resize it. Otherwise return original.
    if(url.includes("images.unsplash.com")) {
        // Replace existing w parameter or append new one. 
        // 1200px width with 60 quality is a good balance for background blur
        if(url.includes("?")) {
            return `${url}&w=1200&q=60`;
        }
        return `${url}?w=1200&q=60`;
    }
    return url;
  };

  return (
    <div className="bg-[#050505]">
      {/* Bio Section - Distinct ID for snapping */}
      <SectionWrapper id="about" className="!pb-24 border-b border-white/5 relative overflow-hidden">
        {/* Subtle white atmosphere */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        
        {/* Side-by-Side Layout */}
        <div className="flex flex-row items-center gap-6 md:gap-16 lg:gap-24">
            
            {/* Portrait Column */}
            <div className="w-[38%] md:w-[45%] lg:w-[40%] flex-shrink-0 relative">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative z-10 w-full shadow-2xl"
                >
                    <div className="relative aspect-[3/4.2] md:aspect-[3/4] rounded-2xl md:rounded-[4rem] overflow-hidden border border-white/10 group">
                        <img 
                            src={portrait} 
                            alt="Liam Leslie" 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
                        />
                        {/* Grain removed from here */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90"></div>
                        
                        {/* Caption Overlay */}
                        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 z-20 max-w-[85%]">
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                viewport={{ once: true }}
                                className="glass-panel px-5 py-4 md:px-8 md:py-6 rounded-2xl bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl"
                            >
                                <p className="text-white font-black text-xl md:text-3xl lg:text-4xl tracking-tight mb-2 leading-none">Liam Leslie</p>
                                <div className="flex items-center gap-2 md:gap-3">
                                    <p className="text-white/90 text-[9px] md:text-[10px] font-bold uppercase tracking-[0.25em]">Creative Director</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                    <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/[0.03] rounded-full blur-[50px] md:blur-[100px] pointer-events-none"></div>
                </motion.div>
            </div>

            {/* Content Column */}
            <div className="flex-1 flex flex-col justify-center text-left">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-3 md:space-y-12"
                >
                    <div>
                        <span className="text-[6px] md:text-xs font-black uppercase tracking-[0.4em] text-white/40 block mb-1 md:mb-4">{subtitle}</span>
                        <h2 className="text-[clamp(1.1rem,5vw,6rem)] font-black text-white leading-[0.95] tracking-tighter">
                            Visualizing <br className="hidden md:block" />
                            <span className="text-white italic lowercase tracking-tight">the unseen.</span>
                        </h2>
                    </div>

                    <p className="text-[9px] sm:text-sm md:text-xl lg:text-2xl text-gray-400 font-light leading-snug md:leading-relaxed tracking-tight max-w-xl">
                        {description}
                    </p>

                    <div className="pt-1 md:pt-6 flex flex-col sm:flex-row gap-3 md:gap-10 items-start sm:items-center">
                        <MagneticButton variant="primary" className="!px-5 md:!px-14 !py-2.5 md:!py-5 !text-[8px] md:!text-sm !font-black uppercase tracking-widest shadow-xl">
                            Connect
                        </MagneticButton>
                        <button className="flex items-center gap-2 md:gap-4 text-white font-black tracking-[0.2em] md:tracking-[0.3em] uppercase text-[6px] md:text-[11px] group">
                            Our Story <ArrowRight className="w-3 h-3 md:w-5 md:h-5 text-white/40 group-hover:translate-x-3 transition-transform duration-500" />
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
      </SectionWrapper>

      {/* Testimonials - Distinct ID for snapping */}
      <section id="testimonials" className="py-24 md:py-32 bg-[#050505] overflow-hidden relative">
        {/* Background with optimized gradients - removed backdrop blur for performance */}
        {testimonialsBackground && (
            <div className="absolute inset-0 z-0">
                <img 
                    src={getOptimizedBg(testimonialsBackground)} 
                    alt="Background" 
                    className="w-full h-full object-cover opacity-60" 
                />
                <div className="absolute inset-0 bg-[#050505]/60"></div>
                {/* Smoother vertical gradients to prevent glitching at edges */}
                <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#050505] to-transparent pointer-events-none z-10"></div>
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none z-10"></div>
            </div>
        )}

        <div className="container px-6 md:px-12 lg:px-24 mx-auto mb-16 relative z-10">
            <div className="max-w-3xl">
                <span className="text-[10px] font-black uppercase tracking-[0.6em] text-white/60 block mb-4">Partners</span>
                <h2 className="text-4xl md:text-8xl font-black text-white tracking-tighter leading-none">
                    Trusted by <br />
                    <span className="text-white/90">Visionaries.</span>
                </h2>
            </div>
        </div>

        <div className="relative flex overflow-hidden z-10 w-full">
            <motion.div 
                className="flex gap-6 md:gap-12 py-10 pl-6 md:pl-12 w-max"
                // Animate from 0 to -50% creates a perfect loop if items are doubled/quadrupled
                animate={{ x: ["0%", "-50%"] }}
                transition={{ 
                    duration: 60, 
                    repeat: Infinity, 
                    ease: "linear"
                }}
            >
                {marqueeItems.map((testimonial, i) => (
                    <div
                        key={`${testimonial.id}-${i}`}
                        className="w-[280px] md:w-[540px] p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] flex flex-col justify-between border border-white/10 relative group transition-all duration-700 hover:border-white/20 shadow-2xl bg-white/[0.03] backdrop-blur-3xl hover:bg-white/[0.06]"
                    >
                        <div className="relative z-10">
                            {/* Adjusted Quote position to not overlap text */}
                            <Quote size={60} className="text-white/10 absolute -top-4 -left-2 md:-top-8 md:-left-6 group-hover:text-white/20 transition-colors duration-700 z-0" />
                            <p className="text-base md:text-3xl text-white font-light italic leading-snug mb-10 md:mb-16 tracking-tight relative z-10 mt-6 md:mt-4">
                                "{testimonial.text}"
                            </p>
                        </div>

                        <div className="flex items-center gap-4 md:gap-8 mt-auto">
                            {/* Logo instead of Avatar */}
                            <div className="h-8 md:h-12 w-auto opacity-70 group-hover:opacity-100 transition-opacity duration-500">
                                <img 
                                    src={testimonial.avatar} 
                                    alt={testimonial.company} 
                                    className="h-full w-auto object-contain brightness-0 invert" 
                                />
                            </div>
                            
                            {/* Vertical Separator */}
                            <div className="h-8 w-[1px] bg-white/20"></div>

                            <div className="space-y-0.5">
                                <h4 className="text-white font-black text-xs md:text-sm uppercase tracking-wider">{testimonial.name}</h4>
                                <p className="text-gray-400 text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-bold">{testimonial.company}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
      </SectionWrapper>
    </div>
  );
};

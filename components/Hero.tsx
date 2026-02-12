
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MagneticButton } from './ui/MagneticButton';
import { Play } from 'lucide-react';
import { ShaderAnimation } from './ui/ShaderAnimation';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const letterVariants = {
    hidden: { opacity: 0, y: 100, filter: 'blur(20px)', scale: 1.1 },
    visible: { 
        opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, 
        transition: { duration: 1.4, ease: [0.19, 1, 0.22, 1] } 
    }
  };

  const titleVariants = {
    hidden: { opacity: 0 },
    // Increased delay to allow the shader animation to "play once" (be seen) before text appears
    visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 1.2 } }
  };

  return (
    <div id="hero" ref={containerRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background Depth - Blue Gradient Top Right */}
      <div className="absolute inset-0 z-0 bg-black pointer-events-none">
         {/* Top Right Blue Glow - Adjusted for depth */}
         <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vh] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/40 via-blue-950/20 to-transparent blur-[140px] mix-blend-screen opacity-70"></div>
         
         {/* Bottom Fade */}
         <div className="absolute bottom-0 left-0 w-full h-[30vh] bg-gradient-to-t from-black to-transparent z-10"></div>
      </div>

      {/* Shader Animation Background */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <ShaderAnimation className="opacity-80" />
      </motion.div>

      {/* Main Hero Content */}
      <div className="relative z-20 container px-6 mx-auto flex flex-col items-center text-center pt-24 pointer-events-none">
        <div className="max-w-4xl pointer-events-auto">
            <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 1, delay: 1.5 }}
                className="mb-8"
            >
                <span className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl text-[10px] md:text-xs font-black text-white uppercase tracking-[0.4em] shadow-2xl">
                    Cinematic Creative Studio
                </span>
            </motion.div>
            
            <motion.h1 
                variants={titleVariants} 
                initial="hidden" 
                animate="visible" 
                className="text-[clamp(3rem,10vw,8.5rem)] font-black tracking-[-0.05em] text-white mb-8 leading-[0.85]"
            >
                <span className="block py-2 overflow-visible">
                    {"Stories that".split("").map((char, i) => (
                        <motion.span key={i} variants={letterVariants} className="inline-block origin-bottom">{char === " " ? "\u00A0" : char}</motion.span>
                    ))}
                </span>
                <span className="block py-2 overflow-visible">
                    {"move people".split("").map((char, i) => (
                        <motion.span key={i} variants={letterVariants} className="inline-block origin-bottom">{char === " " ? "\u00A0" : char}</motion.span>
                    ))}
                </span>
            </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 40 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 1, delay: 2.0 }}
            className="text-base md:text-xl lg:text-2xl text-gray-400 max-w-xl mx-auto mb-12 font-light leading-relaxed tracking-tight"
          >
            We blend raw narrative with high-end aesthetic to build legacies. Visual craftsmanship at the highest level.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full"
          >
            <MagneticButton variant="primary" className="!px-14 !py-5 !text-base !font-black">View Work</MagneticButton>
            <MagneticButton variant="glass" className="!px-10 !py-5">
              <Play size={20} fill="currentColor" />
              <span className="ml-2 font-black uppercase tracking-widest">Watch Reel</span>
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/30 pointer-events-none">
        <div className="w-[1px] h-14 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
        <span className="text-[9px] uppercase tracking-[0.5em] font-black">Scroll</span>
      </div>
    </div>
  );
};

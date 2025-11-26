
import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { MagneticButton } from './ui/MagneticButton';
import { Play } from 'lucide-react';

// Star Component
const Star: React.FC<{ mouseX: any; mouseY: any }> = ({ mouseX, mouseY }) => {
    // Random initial positions and sizes
    const randomTop = Math.random() * 100;
    const randomLeft = Math.random() * 100;
    const size = Math.random() * 2 + 1;
    const duration = Math.random() * 2 + 1.5;
    const delay = Math.random() * 2;
    
    // Parallax factor (some move faster than others)
    const factor = Math.random() * 30 + 10; 
    
    const x = useTransform(mouseX, [0, window.innerWidth], [factor, -factor]);
    const y = useTransform(mouseY, [0, window.innerHeight], [factor, -factor]);

    return (
        <motion.div
            style={{ 
                top: `${randomTop}%`, 
                left: `${randomLeft}%`,
                x,
                y
            }}
            className="absolute rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
                opacity: [0.2, 0.8, 0.2], 
                scale: [1, 1.2, 1] 
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "easeInOut"
            }}
        >
            <div style={{ width: size, height: size }} />
        </motion.div>
    );
};

export const Hero: React.FC = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Mouse tracking for star parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Generate a fixed set of stars
  const [stars, setStars] = useState<number[]>([]);
  useEffect(() => {
    setStars(Array.from({ length: 40 }, (_, i) => i));
  }, []);

  return (
    <div 
        id="hero"
        ref={ref} 
        className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black snap-start"
        onMouseMove={handleMouseMove}
    >
      {/* Stars Background */}
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 z-0 overflow-hidden"
      >
        <div className="absolute inset-0 w-full h-full max-w-6xl mx-auto opacity-70">
            {stars.map((i) => (
                <Star key={i} mouseX={smoothX} mouseY={smoothY} />
            ))}
        </div>
      </motion.div>

      <div className="relative z-10 container px-6 mx-auto flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
            <div className="mb-6 flex justify-center w-full">
                <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-medium text-gray-300 uppercase tracking-widest">
                    Creative Studio
                </span>
            </div>
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter text-white mb-8 leading-[0.9]">
            Stories That <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-400 to-gray-600">
              Move People
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-light">
            We blend cinematic visuals with strategic storytelling to build brands that leave a legacy.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            <MagneticButton variant="primary">
              View Work
            </MagneticButton>
            <MagneticButton variant="glass" onClick={(e) => { e.preventDefault(); console.log('Show reel')}}>
                <Play size={16} fill="currentColor" />
                <span className="ml-1">Watch Reel</span>
            </MagneticButton>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
      </motion.div>
    </div>
  );
};

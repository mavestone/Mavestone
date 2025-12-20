
import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { MagneticButton } from './ui/MagneticButton';
import { Play } from 'lucide-react';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    let particles: Particle[] = [];
    let animationFrameId: number;
    const mouse = { x: -1000, y: -1000 };

    // Starfield Configuration - Extremely Dense & Interactive
    const PARTICLE_COUNT = width > 768 ? 12000 : 5000; 
    const SPEED_Z = 0.2; 
    // Increased interaction radius to create a more visible "wake" while maintaining the tight feel
    const INTERACTION_RADIUS = 80; 
    const FOCAL_LENGTH = 300; 
    const DEPTH = 2000; 

    class Particle {
      x: number; 
      y: number; 
      z: number; 
      ox: number; 
      oy: number; 
      size: number;
      hue: number;
      baseAlpha: number;
      twinkleSpeed: number;
      twinkleOffset: number;

      constructor(initialZ?: number) {
        this.x = (Math.random() - 0.5) * width * 4;
        this.y = (Math.random() - 0.5) * height * 4;
        this.z = initialZ ?? Math.random() * DEPTH;
        this.ox = this.x;
        this.oy = this.y;
        
        // Much more visible particles
        // 95% are small dust (0.5 - 2.0px), 5% are bright stars (2.0 - 4.0px)
        this.size = Math.random() < 0.95 ? Math.random() * 1.5 + 0.5 : Math.random() * 2.0 + 2.0; 
        
        // Higher base alpha for better visibility
        this.baseAlpha = Math.random() * 0.5 + 0.5; 
        this.hue = 215 + Math.random() * 30; // Cold blue-white range
        
        this.twinkleSpeed = Math.random() * 0.005 + 0.001;
        this.twinkleOffset = Math.random() * Math.PI * 2;
      }

      update() {
        // Zoom towards viewer
        this.z -= SPEED_Z;

        // Reset cleanly to back
        if (this.z <= 1) {
            this.z = DEPTH;
            this.x = (Math.random() - 0.5) * width * 4;
            this.y = (Math.random() - 0.5) * height * 4;
            this.ox = this.x;
            this.oy = this.y;
        }

        const projectionScale = FOCAL_LENGTH / (FOCAL_LENGTH + this.z);
        const sx = width / 2 + this.x * projectionScale;
        const sy = height / 2 + this.y * projectionScale;

        // Mouse Interaction
        const dx = mouse.x - sx;
        const dy = mouse.y - sy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < INTERACTION_RADIUS) {
            const force = (INTERACTION_RADIUS - dist) / INTERACTION_RADIUS;
            const angle = Math.atan2(dy, dx);
            
            // Much stronger repulsive force to create a clear void/wake (was 5, now 40)
            const push = force * 40; 
            
            this.x -= Math.cos(angle) * push; 
            this.y -= Math.sin(angle) * push;
        } else {
             // Return home (elasticity)
            const dxHome = this.ox - this.x;
            const dyHome = this.oy - this.y;
            this.x += dxHome * 0.05; // Faster return
            this.y += dyHome * 0.05;
        }

        return { sx, sy, scale: projectionScale };
      }

      draw(sx: number, sy: number, scale: number) {
        const time = Date.now();
        const twinkle = Math.sin(time * this.twinkleSpeed + this.twinkleOffset) * 0.2; 
        
        // Clamp alpha 
        const alpha = Math.max(0.2, Math.min(1, (this.baseAlpha + twinkle)));

        // Smooth fade in/out at extremes of depth
        const depthAlpha = Math.min(1, (DEPTH - this.z) / 400) * Math.min(1, this.z / 100);
        const finalAlpha = alpha * depthAlpha;

        if (finalAlpha < 0.01) return;

        ctx!.fillStyle = `hsla(${this.hue}, 90%, 95%, ${finalAlpha})`;
        ctx!.beginPath();
        const renderSize = this.size * scale; 
        ctx!.arc(sx, sy, renderSize, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const init = () => {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle(Math.random() * DEPTH));
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        // Draw background gradient directly on canvas for better blend performance if needed, 
        // but currently we rely on CSS background. 
        
        for (let i = 0; i < particles.length; i++) {
            const { sx, sy, scale } = particles[i].update();
            // Only draw if within viewport bounds (with padding)
            if (sx >= -50 && sx <= width + 50 && sy >= -50 && sy <= height + 50) {
                particles[i].draw(sx, sy, scale);
            }
        }
        animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        init();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    return () => {
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const letterVariants = {
    hidden: { opacity: 0, y: 100, filter: 'blur(20px)', scale: 1.1 },
    visible: { 
        opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, 
        transition: { duration: 1.4, ease: [0.19, 1, 0.22, 1] } 
    }
  };

  const titleVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.04, delayChildren: 0.2 } }
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

      {/* Particle Canvas */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0 overflow-hidden pointer-events-none mix-blend-screen">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </motion.div>

      {/* Main Hero Content */}
      <div className="relative z-20 container px-6 mx-auto flex flex-col items-center text-center pt-24 pointer-events-none">
        <div className="max-w-4xl pointer-events-auto">
            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}
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
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }}
            className="text-base md:text-xl lg:text-2xl text-gray-400 max-w-xl mx-auto mb-12 font-light leading-relaxed tracking-tight"
          >
            We blend raw narrative with high-end aesthetic to build legacies. Visual craftsmanship at the highest level.
          </motion.p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full">
            <MagneticButton variant="primary" className="!px-14 !py-5 !text-base !font-black">View Work</MagneticButton>
            <MagneticButton variant="glass" className="!px-10 !py-5">
              <Play size={20} fill="currentColor" />
              <span className="ml-2 font-black uppercase tracking-widest">Watch Reel</span>
            </MagneticButton>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 text-white/30 pointer-events-none">
        <div className="w-[1px] h-14 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
        <span className="text-[9px] uppercase tracking-[0.5em] font-black">Scroll</span>
      </div>
    </div>
  );
};

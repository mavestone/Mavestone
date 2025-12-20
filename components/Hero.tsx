
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

  // Canvas Galaxy Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Handle High DPI
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    let particles: Particle[] = [];
    let animationFrameId: number;
    
    // Mouse state
    const mouse = { x: -1000, y: -1000 };

    // Configuration
    const PARTICLE_COUNT = width > 768 ? 1600 : 800; 
    const MOUSE_RADIUS = 60; 
    const FRICTION = 0.96; 
    const EASE = 0.002; 
    const BASE_DRIFT_SPEED = 0.15; 

    class Particle {
      x: number;
      y: number;
      originX: number;
      originY: number;
      vx: number;
      vy: number;
      size: number;
      hue: number;
      baseAlpha: number;
      activeAlpha: number;
      twinkleSpeed: number;
      twinklePhase: number;
      z: number; 

      constructor(initialX?: number, initialY?: number, initialZ?: number) {
        this.x = initialX ?? Math.random() * width;
        this.y = initialY ?? Math.random() * height;
        this.originX = this.x;
        this.originY = this.y;
        this.vx = 0;
        this.vy = 0;
        this.z = initialZ ?? Math.random() * 1.5 + 0.5; 
        this.size = Math.random() * 1.2 + 0.5;
        
        this.baseAlpha = Math.random() * 0.4 + 0.3; 
        this.activeAlpha = this.baseAlpha;
        this.twinkleSpeed = Math.random() * 0.04 + 0.01; 
        this.twinklePhase = Math.random() * Math.PI * 2;
        
        this.hue = 190 + (this.x / width) * 120; 
      }

      update() {
        const centerX = width / 2;
        const centerY = height / 2;
        const driftSpeed = BASE_DRIFT_SPEED * this.z;
        
        const dxCenter = this.originX - centerX;
        const dyCenter = this.originY - centerY;
        const distCenter = Math.sqrt(dxCenter*dxCenter + dyCenter*dyCenter);
        
        if (distCenter > 1) {
            this.originX += (dxCenter / distCenter) * driftSpeed;
            this.originY += (dyCenter / distCenter) * driftSpeed;
        } else {
             this.originX += (Math.random() - 0.5) * 2;
             this.originY += (Math.random() - 0.5) * 2;
        }

        if (this.originX < -100 || this.originX > width + 100 || this.originY < -100 || this.originY > height + 100) {
            const angle = Math.random() * Math.PI * 2;
            const minRadius = 150;
            const maxRadius = 600;
            const spawnRadius = minRadius + Math.random() * (maxRadius - minRadius);
            
            this.originX = centerX + Math.cos(angle) * spawnRadius;
            this.originY = centerY + Math.sin(angle) * spawnRadius;
            
            this.x = this.originX;
            this.y = this.originY;
            this.vx = 0;
            this.vy = 0;
            this.activeAlpha = 0; 
        }

        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < MOUSE_RADIUS) {
            const force = (MOUSE_RADIUS - distance) / MOUSE_RADIUS;
            const angle = Math.atan2(dy, dx);
            const pushStrength = 1.5 * this.z; 
            
            this.vx -= Math.cos(angle) * force * pushStrength;
            this.vy -= Math.sin(angle) * force * pushStrength;
            this.activeAlpha = 1;
        }

        const dxHome = this.originX - this.x;
        const dyHome = this.originY - this.y;
        
        this.vx += dxHome * EASE;
        this.vy += dyHome * EASE;

        this.vx *= FRICTION;
        this.vy *= FRICTION;
        
        this.x += this.vx;
        this.y += this.vy;

        this.twinklePhase += this.twinkleSpeed;
        const twinkleVal = Math.sin(this.twinklePhase);
        let targetAlpha = this.baseAlpha + twinkleVal * 0.4; 
        
        const distFromCenter = Math.sqrt(Math.pow(this.x - width/2, 2) + Math.pow(this.y - height/2, 2));
        const maxDist = Math.max(width, height) * 0.6;
        
        const edgeFade = Math.max(0, Math.min(1, (maxDist - distFromCenter) / 100));
        const centerFade = Math.min(1, (distFromCenter - 100) / 200);
        
        targetAlpha *= edgeFade;
        targetAlpha *= centerFade;

        this.activeAlpha += (targetAlpha - this.activeAlpha) * 0.1;
        
        if (this.activeAlpha < 0) this.activeAlpha = 0;
        if (this.activeAlpha > 1) this.activeAlpha = 1;
      }

      draw() {
        if (this.activeAlpha < 0.01) return;
        ctx!.fillStyle = `hsla(${this.hue}, 80%, 75%, ${this.activeAlpha})`;
        ctx!.beginPath();
        ctx!.rect(this.x, this.y, this.size, this.size);
        ctx!.fill();
      }
    }

    const init = () => {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
    };

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
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

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
        mouse.x = -1000;
        mouse.y = -1000;
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseLeave);

    return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseout', handleMouseLeave);
        cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const titleVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.1
      }
    }
  };

  const letterVariants = {
    hidden: { 
        opacity: 0, 
        y: 100, 
        filter: 'blur(20px)',
        scale: 1.1
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      scale: 1,
      transition: { 
          duration: 1.4, 
          ease: [0.19, 1, 0.22, 1] 
      }
    }
  };

  const line1 = "Stories That";
  const line2 = "Move People";

  return (
    <div 
        id="hero"
        ref={containerRef} 
        className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black snap-start"
    >
      <div className="absolute top-0 right-0 w-[500px] h-[600px] bg-gradient-to-bl from-blue-500/20 via-blue-900/5 to-transparent blur-[80px] pointer-events-none opacity-60 z-10" />

      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      >
        <canvas 
            ref={canvasRef}
            className="w-full h-full block"
        />
      </motion.div>

      <div className="relative z-10 container px-6 mx-auto flex flex-col items-center text-center pointer-events-none">
        <div className="max-w-5xl pointer-events-auto">
            <motion.div 
                initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 1, delay: 0.1 }}
                className="mb-8 flex justify-center w-full"
            >
                <span className="px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-[10px] md:text-xs font-semibold text-gray-300 uppercase tracking-[0.2em]">
                    Creative Studio
                </span>
            </motion.div>
            
            <motion.h1 
                variants={titleVariants}
                initial="hidden"
                animate="visible"
                className="text-5xl md:text-7xl lg:text-9xl font-bold tracking-tighter text-white mb-10 leading-[0.9]"
            >
                <span className="block mb-2 md:mb-4 py-2 text-white">
                    {line1.split("").map((char, i) => (
                        <motion.span key={i} variants={letterVariants} className="inline-block origin-bottom pr-[0.05em]">
                            {char === " " ? "\u00A0" : char}
                        </motion.span>
                    ))}
                </span>
                <span className="block py-2 text-white">
                    {line2.split("").map((char, i) => (
                        <motion.span key={i} variants={letterVariants} className="inline-block origin-bottom pr-[0.05em]">
                            {char === " " ? "\u00A0" : char}
                        </motion.span>
                    ))}
                </span>
            </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed"
          >
            We blend cinematic visuals with strategic storytelling to build brands that leave a legacy.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full"
          >
            <MagneticButton variant="primary">
              View Work
            </MagneticButton>
            <MagneticButton variant="glass" onClick={(e) => { e.preventDefault(); console.log('Show reel')}}>
                <Play size={16} fill="currentColor" />
                <span className="ml-1">Watch Reel</span>
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 pointer-events-none"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>
        <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
      </motion.div>
    </div>
  );
};

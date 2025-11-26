
import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { ContentProvider } from './context/ContentContext';
import { AdminPanel } from './components/AdminPanel';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LatestVideo } from './components/LatestVideo';
import { Shorts } from './components/Shorts';
import { Films } from './components/Films';
import { Collaboration } from './components/Collaboration';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  // 60fps Physics based cursor
  // Initialize off-screen to prevent flash
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  // Smooth spring configuration
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Direct updates to motion values for 60fps performance
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      
      const target = e.target as HTMLElement;
      
      // Extended check for interactive elements
      const isClickable = 
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.closest('button') !== null || 
        target.closest('a') !== null ||
        target.closest('.cursor-pointer') !== null ||
        window.getComputedStyle(target).cursor === 'pointer';

      setIsHovering(!!isClickable);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-white/20 selection:text-white cursor-none">
        {/* Grain Overlay */}
        <div className="grain-overlay"></div>

        {/* Custom Physics Cursor */}
        <motion.div 
            className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden md:block backdrop-blur-[1px]"
            style={{ 
                x: cursorXSpring,
                y: cursorYSpring,
                translateX: "-50%",
                translateY: "-50%",
                backgroundColor: "white",
                // Difference blend mode inverts colors: White cursor on black bg -> white. White cursor on white text -> black.
                mixBlendMode: "difference", 
            }}
            animate={{
                width: isHovering ? 64 : 16,
                height: isHovering ? 64 : 16,
                opacity: isHovering ? 1 : 0.8,
            }}
            transition={{
                width: { duration: 0.25, ease: "easeOut" },
                height: { duration: 0.25, ease: "easeOut" },
                opacity: { duration: 0.2 }
            }}
        />

        <Navbar />
        
        <main>
            <Hero />
            <LatestVideo />
            <Shorts />
            <Films />
            <Collaboration />
            <Contact />
        </main>
        
        <Footer />
        <AdminPanel />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ContentProvider>
      <AppContent />
    </ContentProvider>
  );
};

export default App;

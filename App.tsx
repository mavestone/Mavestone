
import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ContentProvider } from './context/ContentContext';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
import { Projects } from './pages/Projects';
import { AdminPanel } from './components/AdminPanel';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Mouse position values (MotionValues for performance)
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Smooth springs for cursor movement
  // Outer circle: Responsive but smooth
  const springConfigOuter = { damping: 20, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfigOuter);
  const cursorY = useSpring(mouseY, springConfigOuter);

  // Inner dot: Slight lag for "premium" feel (heavier mass, lower stiffness)
  const springConfigInner = { damping: 40, stiffness: 200, mass: 0.8 };
  const dotX = useSpring(mouseX, springConfigInner);
  const dotY = useSpring(mouseY, springConfigInner);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const checkHover = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        // Check if the target or its parents are interactive
        const isInteractive = 
            target.tagName === 'A' || 
            target.tagName === 'BUTTON' || 
            target.closest('a') || 
            target.closest('button') ||
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.classList.contains('cursor-pointer') ||
            window.getComputedStyle(target).cursor === 'pointer';
            
        setIsHovering(!!isInteractive);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', checkHover);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', checkHover);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  return (
    <>
        {/* Outer Ring - Now Solid */}
        <motion.div
            className="fixed top-0 left-0 bg-white rounded-full mix-blend-difference pointer-events-none z-[9999] hidden lg:block"
            style={{ 
                x: cursorX, 
                y: cursorY,
                translateX: '-50%',
                translateY: '-50%'
            }}
            animate={{ 
                width: isHovering ? 80 : 40, 
                height: isHovering ? 80 : 40,
                opacity: isVisible ? 1 : 0,
                scale: isVisible ? 1 : 0.5
            }}
            transition={{ 
                width: { duration: 0.2, ease: "easeOut" },
                height: { duration: 0.2, ease: "easeOut" },
                opacity: { duration: 0.2 }
            }}
        />
        
        {/* Inner Dot (Lags behind) */}
        <motion.div
            className="fixed top-0 left-0 bg-white rounded-full mix-blend-difference pointer-events-none z-[9999] hidden lg:block"
            style={{ 
                x: dotX, 
                y: dotY,
                translateX: '-50%',
                translateY: '-50%',
                width: 6,
                height: 6
            }}
            animate={{
                opacity: isVisible ? 1 : 0
            }}
        />
    </>
  );
};

const AppContent: React.FC = () => {
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <div className="bg-black min-h-screen text-white font-sans selection:bg-white/20 selection:text-white cursor-auto lg:cursor-none">
        {/* Grain Overlay */}
        <div className="grain-overlay"></div>

        {/* Cinematic Custom Cursor */}
        <CustomCursor />

        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/projects" element={<Projects />} />
        </Routes>
        
        {/* Global Admin Panel Overlay */}
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

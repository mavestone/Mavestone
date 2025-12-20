
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS } from '../../constants';

export const ScrollIndicator: React.FC = () => {
  const [activeSection, setActiveSection] = useState('#hero');
  const isVisible = true; 

  useEffect(() => {
    const handleScroll = () => {
      const center = window.innerHeight / 2;
      let newActive = '';

      // Iterate through all sections to find which one overlaps the center of the viewport
      for (const item of NAV_ITEMS) {
        const id = item.href.substring(1);
        const element = document.getElementById(id);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the element covers the center line of the viewport
          if (rect.top <= center && rect.bottom >= center) {
            newActive = item.href;
            break; // Stop checking once we found the topmost one covering center
          }
        }
      }

      if (newActive && newActive !== activeSection) {
        setActiveSection(newActive);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection]);

  const handleScrollTo = (href: string) => {
    setActiveSection(href); // Immediate feedback
    const element = document.querySelector(href);
    if (element) {
        // We use native scrollTo, SmoothScroll will pick up the scroll event and animate
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const offset = elementRect - bodyRect;
        
        window.scrollTo({
            top: offset,
            behavior: 'auto'
        });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5 }}
            className="fixed left-6 top-1/2 -translate-y-1/2 z-[50] hidden lg:flex flex-col gap-4 items-center"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.href;
            return (
              <div key={item.label} className="relative group flex items-center">
                {/* Tooltip on hover */}
                <span 
                    className={`absolute left-8 text-[10px] uppercase tracking-widest text-white transition-all duration-300 whitespace-nowrap bg-black/50 backdrop-blur-md px-2 py-1 rounded border border-white/10 ${
                        isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                    }`}
                >
                    {item.label}
                </span>
                
                <button
                  onClick={() => handleScrollTo(item.href)}
                  className={`rounded-full transition-all duration-300 relative outline-none focus:outline-none ${
                    isActive ? 'w-2 h-2 bg-white' : 'w-1 h-1 bg-white/30 hover:bg-white/60 hover:w-1.5 hover:h-1.5'
                  }`}
                  aria-label={`Scroll to ${item.label}`}
                >
                    {isActive && (
                        <motion.div 
                            layoutId="activeGlow"
                            className="absolute inset-0 -m-1 rounded-full bg-white/30 blur-sm"
                            transition={{ duration: 0.3 }}
                        />
                    )}
                </button>
              </div>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

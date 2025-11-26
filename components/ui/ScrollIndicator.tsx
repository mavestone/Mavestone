
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS } from '../../constants';

export const ScrollIndicator: React.FC = () => {
  const [activeSection, setActiveSection] = useState('#hero');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show dots only after scrolling past 50% of the viewport
      if (window.scrollY > window.innerHeight * 0.5) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% visible for better accuracy
    );

    // Observe all sections
    NAV_ITEMS.forEach((item) => {
      const id = item.href.substring(1);
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleScrollTo = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
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
            className="fixed left-6 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col gap-4 items-center"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.href;
            return (
              <div key={item.label} className="relative group flex items-center">
                {/* Tooltip on hover */}
                <span 
                    className={`absolute left-8 text-[10px] uppercase tracking-widest text-white transition-all duration-300 whitespace-nowrap ${
                        isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
                    }`}
                >
                    {item.label}
                </span>
                
                <button
                  onClick={() => handleScrollTo(item.href)}
                  className={`rounded-full transition-all duration-300 relative ${
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

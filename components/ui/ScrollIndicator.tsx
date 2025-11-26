
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NAV_ITEMS } from '../../constants';

export const ScrollIndicator: React.FC = () => {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        });
      },
      { threshold: 0.4 } // Trigger when 40% visible
    );

    // Observe all sections defined in nav
    NAV_ITEMS.forEach((item) => {
      // Clean the href to get the ID (remove #)
      const id = item.href.substring(1);
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleScrollTo = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const offset = 0; // Snap scrolling usually requires landing exactly on top
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col gap-4 items-center">
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
    </div>
  );
};

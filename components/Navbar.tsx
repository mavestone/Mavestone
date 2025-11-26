import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { NAV_ITEMS } from '../constants';
import { MagneticButton } from './ui/MagneticButton';
import { Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [hidden, setHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    
    // Show navbar if scrolling up or at the top
    if (latest < previous || latest < 100) {
      setHidden(false);
    } 
    // Hide navbar if scrolling down and not at the top
    else if (latest > previous && latest > 100 && !isMobileMenuOpen) {
      setHidden(true);
    }
  });

  return (
    <>
      <motion.nav
        variants={{
          visible: { y: 0 },
          hidden: { y: "-100%" },
        }}
        animate={hidden ? "hidden" : "visible"}
        transition={{ duration: 0.35, ease: "easeInOut" }}
        className="fixed top-0 left-0 right-0 z-[60] flex justify-center pt-6 px-6 pointer-events-none"
      >
        <div className="flex items-center justify-between w-full max-w-6xl p-2 pl-6 pr-2 bg-charcoal/80 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl pointer-events-auto">
          <a href="#" className="text-xl font-bold tracking-tighter text-white z-10 cursor-pointer">
            Mavestone<span className="text-white/40">.</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <MagneticButton variant="primary" className="!py-3 !px-6 text-xs cursor-pointer">
                Start a Project
              </MagneticButton>
            </div>
            <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
                aria-label="Open Menu"
            >
                <Menu size={20} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <motion.div 
        initial={{ opacity: 0, pointerEvents: "none" }}
        animate={{ opacity: isMobileMenuOpen ? 1 : 0, pointerEvents: isMobileMenuOpen ? "auto" : "none" }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center"
      >
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-8 right-8 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Close Menu"
        >
            <X size={24} />
        </button>
        <div className="flex flex-col gap-8 text-center">
            {NAV_ITEMS.map((item) => (
            <a
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-4xl font-light text-white hover:text-gray-400 transition-colors cursor-pointer"
            >
                {item.label}
            </a>
            ))}
              <div className="mt-8">
                <MagneticButton variant="primary" onClick={() => setIsMobileMenuOpen(false)}>
                  Start a Project
                </MagneticButton>
              </div>
        </div>
      </motion.div>
    </>
  );
};
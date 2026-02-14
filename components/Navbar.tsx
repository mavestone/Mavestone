
import React, { useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { NAV_ITEMS } from '../constants';
import { MagneticButton } from './ui/MagneticButton';
import { Menu, X, Instagram, Linkedin, Youtube } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { useNavigate, useLocation } from 'react-router-dom';

// Custom Icons for X and TikTok
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export const Navbar: React.FC = () => {
  const [hidden, setHidden] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const { isAuthenticated, logout, openAdmin } = useContent();
  const navigate = useNavigate();
  const location = useLocation();

  const socialLinks = [
    { href: "https://www.instagram.com/mavestonemedia", icon: <Instagram size={24} />, label: "Instagram" },
    { href: "https://x.com/mavestone", icon: <XIcon className="w-6 h-6" />, label: "X" },
    { href: "https://www.linkedin.com/company/mavestone/", icon: <Linkedin size={24} />, label: "LinkedIn" },
    { href: "https://www.youtube.com/@mavestone", icon: <Youtube size={24} />, label: "YouTube" },
    { href: "https://www.tiktok.com/@mavestone", icon: <TikTokIcon className="w-6 h-6" />, label: "TikTok" },
  ];

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

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>, href: string) => {
    e.preventDefault();
    
    // Handle Route Links (e.g. /projects)
    if (href.startsWith('/')) {
        navigate(href);
        setIsMobileMenuOpen(false);
        window.scrollTo(0, 0);
        return;
    }

    // Handle Hash Links
    const scrollToElement = () => {
        const element = document.querySelector(href);
        if (element) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    if (location.pathname !== '/') {
        navigate('/');
        // Wait for navigation to complete before scrolling
        setTimeout(scrollToElement, 100);
    } else {
        scrollToElement();
    }
    setIsMobileMenuOpen(false);
  };

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
          <a href="#" className="text-xl font-bold tracking-tighter text-white z-10 cursor-pointer" onClick={(e) => { e.preventDefault(); if(location.pathname !== '/') { navigate('/'); window.scrollTo({top:0}); } else { window.scrollTo({top: 0, behavior: 'smooth'}); } }}>
            Mavestone<span className="text-white/40">.</span>
          </a>

          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleScroll(e, item.href)}
                className="text-sm text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              {isAuthenticated ? (
                  <div className="flex items-center gap-2">
                    <button onClick={openAdmin} className="text-xs font-bold text-white bg-white/20 px-3 py-2 rounded-full hover:bg-white/30 transition-colors">
                        Admin
                    </button>
                    <button onClick={() => logout()} className="text-xs text-red-400 px-2 py-2 hover:text-white transition-colors">
                        Logout
                    </button>
                  </div>
              ) : (
                <MagneticButton variant="primary" className="!py-3 !px-6 text-xs cursor-pointer" onClick={(e) => handleScroll(e, '#contact')}>
                    Start a Project
                </MagneticButton>
              )}
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
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center cursor-auto"
      >
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-8 right-8 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Close Menu"
        >
            <X size={24} />
        </button>
        <div className="flex flex-col gap-8 text-center items-center w-full max-w-sm px-6">
            <div className="flex flex-col gap-6">
              {NAV_ITEMS.map((item) => (
              <a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleScroll(e, item.href)}
                  className="text-4xl font-light text-white hover:text-gray-400 transition-colors cursor-pointer"
              >
                  {item.label}
              </a>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-center gap-4 w-full">
              {isAuthenticated ? (
                  <MagneticButton variant="secondary" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>
                      Logout
                  </MagneticButton>
              ) : (
                  <MagneticButton variant="primary" className="w-full max-w-[200px] flex justify-center mx-auto" onClick={(e) => handleScroll(e, '#contact')}>
                      Start a Project
                  </MagneticButton>
              )}
            </div>

            {/* Social Links for Mobile */}
            <div className="mt-8 flex items-center justify-center gap-6 pt-8 border-t border-white/10 w-full">
                {socialLinks.map((link) => (
                    <a 
                        key={link.label}
                        href={link.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors duration-300 transform active:scale-95"
                        aria-label={link.label}
                    >
                        {link.icon}
                    </a>
                ))}
            </div>
        </div>
      </motion.div>
    </>
  );
};

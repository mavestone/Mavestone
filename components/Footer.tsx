
import React from 'react';
import { useContent } from '../context/ContentContext';
import { Instagram, Linkedin, Youtube } from 'lucide-react';

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

export const Footer: React.FC = () => {
  const { toggleAdmin } = useContent();

  const socialLinks = [
    { href: "https://www.instagram.com/mavestonemedia", icon: <Instagram size={20} />, label: "Instagram" },
    { href: "https://x.com/mavestone", icon: <XIcon className="w-5 h-5" />, label: "X" },
    { href: "https://www.linkedin.com/company/mavestone/", icon: <Linkedin size={20} />, label: "LinkedIn" },
    { href: "https://www.youtube.com/@mavestone", icon: <Youtube size={20} />, label: "YouTube" },
    { href: "https://www.tiktok.com/@mavestone", icon: <TikTokIcon className="w-5 h-5" />, label: "TikTok" },
  ];

  return (
    <footer className="w-full py-12 border-t border-white/5 bg-black text-center relative z-10">
      <div className="container mx-auto px-6 flex flex-col items-center">
        <h3 className="text-2xl font-bold tracking-tighter text-white mb-8">Mavestone.</h3>
        
        <div className="flex gap-8 mb-8 items-center">
            {socialLinks.map((link) => (
                <a 
                    key={link.label}
                    href={link.href} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-white transition-colors duration-300 transform hover:scale-110"
                    aria-label={link.label}
                >
                    {link.icon}
                </a>
            ))}
        </div>

        <div className="flex flex-col items-center gap-4">
            <p className="text-gray-600 text-xs">
                © {new Date().getFullYear()} Mavestone Studio. All rights reserved.
            </p>
            <button 
                onClick={toggleAdmin}
                className="text-[10px] text-gray-800 hover:text-gray-600 transition-colors uppercase tracking-widest cursor-pointer"
            >
                Admin Login
            </button>
        </div>
      </div>
    </footer>
  );
};

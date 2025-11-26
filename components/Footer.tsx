
import React from 'react';
import { useContent } from '../context/ContentContext';

export const Footer: React.FC = () => {
  const { toggleAdmin } = useContent();

  return (
    <footer className="w-full py-12 border-t border-white/5 bg-black text-center relative z-10">
      <div className="container mx-auto px-6 flex flex-col items-center">
        <h3 className="text-2xl font-bold tracking-tighter text-white mb-6">Mavestone.</h3>
        <div className="flex gap-8 mb-8">
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Instagram</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Twitter</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">LinkedIn</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">Vimeo</a>
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

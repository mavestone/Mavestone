
import React from 'react';
import { SectionWrapper } from './ui/SectionWrapper';
import { Linkedin, Instagram } from 'lucide-react';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export const Contact: React.FC = () => {
  return (
    <SectionWrapper id="contact" className="mb-12 md:mb-24">
      <div className="w-full max-w-4xl mx-auto bg-[#0A0A0A] backdrop-blur-3xl border border-white/5 rounded-[2.5rem] md:rounded-[3.5rem] p-8 sm:p-12 md:p-16 overflow-hidden relative shadow-2xl text-center">
        <div className="absolute top-0 right-1/2 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[#C9A96E] block mb-4">
            Connect & Collaborate
          </span>
          
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-tight">
            Let's craft a <br />
            <span className="text-white/40">masterpiece.</span>
          </h2>
          
          <p className="text-gray-400 mb-10 font-medium text-sm sm:text-base md:text-lg max-w-lg leading-relaxed">
            Tell us your vision, and we'll engineer the cinematic outcome. Reach out directly through our primary channels.
          </p>
          
          {/* Social Action Buttons */}
          <div className="flex items-center justify-center gap-5 sm:gap-6 md:gap-8 mb-10">
            <a 
              href="https://www.linkedin.com/in/liamleslie/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#0077b5] border border-[#0077b5] flex items-center justify-center text-white hover:scale-110 transition-all shadow-lg hover:shadow-[#0077b5]/30 duration-300 group"
              aria-label="LinkedIn"
            >
              <Linkedin size={22} className="sm:w-7 sm:h-7" fill="currentColor" strokeWidth={0} />
            </a>

            <a 
              href="https://wa.me/61449035614" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] border border-[#25D366] flex items-center justify-center text-white hover:scale-110 transition-all shadow-lg hover:shadow-[#25D366]/30 duration-300 group"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="w-7 h-7 sm:w-8 sm:h-8" />
            </a>

            <a 
              href="https://www.instagram.com/mavestonemedia" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] border border-pink-500/20 flex items-center justify-center text-white hover:scale-110 transition-all shadow-lg hover:shadow-pink-500/30 duration-300 group"
              aria-label="Instagram"
            >
              <Instagram size={22} className="sm:w-7 sm:h-7" strokeWidth={2} />
            </a>
          </div>

          <div className="pt-8 border-t border-white/5 w-full flex flex-col items-center justify-center">
            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Primary Contact</h4>
            <a 
              href="mailto:hello@mavestone.com" 
              className="text-xl sm:text-2xl md:text-3xl font-bold text-white hover:text-[#C9A96E] transition-colors tracking-tight font-sans"
            >
              hello@mavestone.com
            </a>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};


import React from 'react';
import { SectionWrapper } from './ui/SectionWrapper';
import { MagneticButton } from './ui/MagneticButton';
import { Send, Linkedin } from 'lucide-react';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export const Contact: React.FC = () => {
  return (
    <SectionWrapper id="contact" className="mb-24">
      <div className="w-full max-w-5xl mx-auto bg-soft-black/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-16 overflow-hidden relative">
        {/* Decorative Background Blob */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="flex flex-col justify-between">
                <div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Let's create something legendary.</h2>
                    <p className="text-gray-400 mb-8">Tell us your creative vision, lets bring it to life!</p>
                    
                    <div className="flex gap-4 mb-8">
                        <a 
                            href="https://www.linkedin.com/in/liamleslie/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-full bg-[#0077B5] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-blue-900/20"
                            aria-label="LinkedIn"
                        >
                            <Linkedin size={24} fill="currentColor" strokeWidth={0} />
                        </a>
                        <a 
                            href="https://wa.me/61449035614" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:scale-110 transition-transform shadow-lg shadow-green-900/20"
                            aria-label="WhatsApp"
                        >
                            <WhatsAppIcon className="w-6 h-6" />
                        </a>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Email</h4>
                            <a href="mailto:hello@mavestone.com" className="text-gray-400 hover:text-white transition-colors">hello@mavestone.com</a>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Studio</h4>
                            <p className="text-gray-400">Los Angeles, CA</p>
                        </div>
                    </div>
                </div>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500 ml-1">Name</label>
                    <input 
                        type="text" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                        placeholder="John Doe"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500 ml-1">Email</label>
                    <input 
                        type="email" 
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                        placeholder="john@example.com"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-gray-500 ml-1">Message</label>
                    <textarea 
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all resize-none"
                        placeholder="Tell us about your project..."
                    ></textarea>
                </div>

                <div className="pt-4">
                    <MagneticButton variant="primary" className="w-full">
                        <span>Send Project</span>
                        <Send size={16} />
                    </MagneticButton>
                </div>
            </form>
        </div>
      </div>
    </SectionWrapper>
  );
};
import React from 'react';
import { SectionWrapper } from './ui/SectionWrapper';
import { MagneticButton } from './ui/MagneticButton';
import { Send } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <SectionWrapper id="contact" className="mb-24">
      <div className="w-full max-w-5xl mx-auto bg-soft-black/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-16 overflow-hidden relative">
        {/* Decorative Background Blob */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Let's build something legendary.</h2>
                <p className="text-gray-400 mb-8">Tell us what you’re building. We’ll help bring it to life.</p>
                
                <div className="space-y-6">
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Email</h4>
                        <p className="text-gray-400">hello@mavestone.studio</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Studio</h4>
                        <p className="text-gray-400">Los Angeles, CA</p>
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

import React, { useState } from 'react';
import { SectionWrapper } from './ui/SectionWrapper';
import { MagneticButton } from './ui/MagneticButton';
import { Send, Linkedin, CheckCircle, Loader2 } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export const Contact: React.FC = () => {
  const { sendMessage } = useContent();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
        setError("Please fill in all fields.");
        return;
    }
    
    setError('');
    setLoading(true);

    const { success } = await sendMessage(formData.name, formData.email, formData.message);

    if (success) {
        setSuccess(true);
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSuccess(false), 5000);
    } else {
        setError("Failed to send message. Please try again.");
    }
    setLoading(false);
  };

  return (
    <SectionWrapper id="contact" className="mb-24">
      <div className="w-full max-w-5xl mx-auto bg-[#0A0A0A] backdrop-blur-3xl border border-white/5 rounded-[2rem] md:rounded-[4rem] p-8 md:p-16 overflow-hidden relative shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="flex flex-col justify-between">
                <div>
                    <h2 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-none">Let's craft a <br/><span className="text-white/40">masterpiece.</span></h2>
                    <p className="text-gray-400 mb-8 font-medium">Tell us your vision, and we'll engineer the cinematic outcome.</p>
                    
                    <div className="flex gap-6 mb-8">
                        <a 
                            href="https://www.linkedin.com/in/liamleslie/" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-14 h-14 rounded-full bg-[#0077b5] border border-[#0077b5] flex items-center justify-center text-white hover:scale-110 transition-all shadow-lg duration-300"
                            aria-label="LinkedIn"
                        >
                            <Linkedin size={24} fill="currentColor" strokeWidth={0} />
                        </a>
                        <a 
                            href="https://wa.me/61449035614" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-14 h-14 rounded-full bg-[#25D366] border border-[#25D366] flex items-center justify-center text-white hover:scale-110 transition-all shadow-lg duration-300"
                            aria-label="WhatsApp"
                        >
                            <WhatsAppIcon className="w-7 h-7" />
                        </a>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-2">Primary Contact</h4>
                            <a href="mailto:hello@mavestone.com" className="text-2xl font-bold text-white hover:text-white/60 transition-colors tracking-tight">hello@mavestone.com</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative">
                {success ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 text-center p-8 animate-in fade-in duration-500">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-4">
                            <CheckCircle size={32} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2">Sent Successfully</h3>
                        <p className="text-gray-300 font-medium">Liam will review your inquiry shortly.</p>
                    </div>
                ) : (
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 ml-1">Identity</label>
                            <input 
                                type="text" 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 md:p-5 text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all font-medium"
                                placeholder="YOUR FULL NAME"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 ml-1">Email</label>
                            <input 
                                type="email" 
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 md:p-5 text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all font-medium"
                                placeholder="YOUR@EMAIL.COM"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 ml-1">The Vision</label>
                            <textarea 
                                rows={4}
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl p-4 md:p-5 text-white focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all resize-none font-medium"
                                placeholder="DESCRIBE YOUR PROJECT..."
                            ></textarea>
                        </div>
                        
                        {error && <p className="text-red-400 text-xs font-bold text-center">{error}</p>}

                        <div className="pt-4">
                            <MagneticButton variant="primary" className="w-full !py-5 !font-black !text-sm uppercase tracking-widest">
                                {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                                <span>{loading ? 'Transmitting...' : 'Initiate Project'}</span>
                            </MagneticButton>
                        </div>
                    </form>
                )}
            </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../context/ContentContext';

export const Hiring: React.FC = () => {
    const { hiringData } = useContent();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Hiring - Liam Cinema";
    }, []);

    if (!hiringData) return null;

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-24 pb-32">
            <div className="max-w-3xl mx-auto px-6 sm:px-12">
                
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="mb-16"
                >
                    <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter mb-6 leading-[0.9]">
                        {hiringData.titleLine1}<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">{hiringData.titleLine2}</span><br />
                        <span className="text-white/40">{hiringData.titleLine3}</span>
                    </h1>
                    <div className="h-[1px] w-full bg-white/10 mb-8" />
                    
                    <div className="prose prose-invert prose-lg text-white/70">
                        <div className="flex flex-col sm:flex-row gap-8 items-start">
                            <img 
                                src="https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=400&auto=format&fit=crop" 
                                alt="Liam" 
                                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border border-white/10 shrink-0" 
                            />
                            <div>
                                <p className="text-xl leading-relaxed text-white/90 font-medium">
                                    {hiringData.introParagraph1}
                                </p>
                                <p className="mt-4">
                                    {hiringData.introParagraph2}
                                </p>
                                <p className="mt-6 text-blue-300/90 font-medium italic border-l-2 border-blue-400/50 pl-4 py-1">
                                    {hiringData.introParagraph3}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Role Details */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-16"
                >
                    {/* The Role */}
                    <section>
                        <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-blue-400 mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-blue-400" />
                            Must be able to
                        </h2>
                        <ul className="space-y-4">
                            {hiringData.roleRequirements.map((item, i) => (
                                <li key={i} className="flex gap-4 items-start text-white/80">
                                    <span className="text-blue-400/50 mt-1">{"//"}</span>
                                    <span>
                                        {item.includes("DaVinci Resolve") ? (
                                            <span className="flex items-center gap-2">
                                                {item}
                                                <img src="https://upload.wikimedia.org/wikipedia/commons/4/4d/DaVinci_Resolve_Studio.png" alt="DaVinci Resolve" className="w-5 h-5 object-contain ml-1" />
                                            </span>
                                        ) : item}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* The Right Fit */}
                    <section>
                        <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-purple-400 mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-400" />
                            What makes a great applicant
                        </h2>
                        <div className="bg-purple-500/5 border border-purple-500/10 p-8 rounded-2xl">
                            <p className="text-white/80 leading-relaxed whitespace-pre-wrap">
                                {hiringData.applicantParagraph}
                            </p>
                        </div>
                    </section>

                    {/* The Trial */}
                    <section>
                        <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-orange-400 mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-400" />
                            The Process
                        </h2>
                        <ol className="list-decimal list-inside space-y-3 text-white/80 font-medium">
                            {hiringData.processSteps.map((step, i) => (
                                <li key={i}>{step}</li>
                            ))}
                        </ol>
                    </section>
                </motion.div>

                {/* CTA */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-20 pt-16 border-t border-white/10 text-center"
                >
                    <h2 className="text-2xl font-bold mb-8">Ready to cut?</h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a 
                            href={hiringData.callToActionURL}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center bg-white text-black px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm hover:bg-white/90 hover:scale-[1.02] transition-all w-full sm:w-auto"
                        >
                            Download Footage
                        </a>
                        <button 
                            onClick={() => alert("Upload form configuration required.")}
                            className="inline-flex items-center justify-center bg-transparent border border-white/20 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm hover:bg-white/5 hover:border-white/40 hover:scale-[1.02] transition-all w-full sm:w-auto"
                        >
                            Submit Your Edit
                        </button>
                    </div>
                    <p className="text-white/40 text-sm mt-6">
                        No rush. Take your time, show your skills.
                    </p>
                </motion.div>
                
            </div>
        </div>
    );
};

export default Hiring;

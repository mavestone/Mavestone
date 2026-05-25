import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export const Hiring: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Hiring - Liam Cinema";
    }, []);

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
                        I'm hiring a<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500">cinematic storyteller/editor</span><br />
                        <span className="text-white/40">to join the team.</span>
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
                                    I'm Liam, a filmmaker and founder. I'm looking for a monthly retainer video editor to cut reels for my personal brand Instagram 
                                    <a href="https://instagram.com/liamcinema" target="_blank" rel="noreferrer" className="text-white underline decoration-white/30 hover:decoration-white transition-colors ml-1">@liamcinema</a>.
                                </p>
                                <p className="mt-4">
                                    You’ll be working with footage from professional cinema cameras across travel films, reels and documentary content.
                                </p>
                                <p className="mt-6 text-blue-300/90 font-medium italic border-l-2 border-blue-400/50 pl-4 py-1">
                                    "If your edits feel like short films instead of 'content', send your work."
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
                            {[
                                "Edit high-end travel & documentary style content",
                                "Follow story and pacing, not just make flashy edits",
                                <span key="davinci" className="flex items-center gap-2">
                                    Colour grade professionally in DaVinci Resolve 
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/4d/DaVinci_Resolve_Studio.png" alt="DaVinci Resolve" className="w-5 h-5 object-contain ml-1" />
                                </span>,
                                "Add motion graphics/text when needed",
                                "Understand cinematic composition, sound design & emotion"
                            ].map((item, i) => (
                                <li key={i} className="flex gap-4 items-start text-white/80">
                                    <span className="text-blue-400/50 mt-1">{"//"}</span>
                                    <span>{item}</span>
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
                            <p className="text-white/80 leading-relaxed">
                                I hire on attitude and taste as much as technical skill. You should be hungry to make the best work possible, not just clock in and drag clips onto a timeline. If you watch a cut and know it could be 1% better, you make it 1% better before sending it. You communicate clearly, hit deadlines effortlessly, and take pride in the craft.
                            </p>
                        </div>
                    </section>

                    {/* The Trial */}
                    <section>
                        <h2 className="text-xs uppercase tracking-[0.2em] font-bold text-orange-400 mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-orange-400" />
                            The Process
                        </h2>
                        <p className="text-white/80 leading-relaxed mb-4">
                            We don't do endless interview rounds. Actions speak louder than resumes.
                        </p>
                        <ol className="list-decimal list-inside space-y-3 text-white/80 font-medium">
                            <li>Download our raw footage from the Google Drive link below.</li>
                            <li>Edit the footage and craft an engaging reel. Take your time, show your skills.</li>
                            <li>Upload your finished cut and submit it for review.</li>
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
                            href="https://drive.google.com/drive/folders/14TULwn541F9Jh1nV42A0fPf93Qi7Di1R?usp=sharing"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center bg-white text-black px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm hover:bg-white/90 hover:scale-[1.02] transition-all w-full sm:w-auto"
                        >
                            Download Footage
                        </a>
                        <button 
                            onClick={() => alert("Upload form configuration required. Please link to your preferred form (e.g., Google Forms, Typeform).")}
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

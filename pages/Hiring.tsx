import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useContent } from '../context/ContentContext';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const staggerCards = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

export const Hiring: React.FC = () => {
    const { hiringData } = useContent();

    useEffect(() => {
        window.scrollTo(0, 0);
        document.title = "Hiring - Liam Cinema";
    }, []);

    if (!hiringData) return null;

    // Common "glass card" class matching the specified system
    const glassCard = "bg-white/[0.04] backdrop-blur-[24px] border border-white/[0.09] shadow-[0_4px_40px_rgba(0,0,0,0.4)] rounded-[20px]";
    const glassCardHover = "hover:bg-white/[0.07] hover:border-white/[0.15] hover:shadow-[0_8px_48px_rgba(0,0,0,0.5)] transition-all duration-300 ease-out";

    return (
        <div className="min-h-screen bg-[#050505] text-[#F5F5F7] selection:bg-[#E8A020] selection:text-black pt-24 pb-32 overflow-hidden border-box">
            
            <div className="max-w-[1140px] mx-auto px-[24px] lg:px-[48px]">
                
                {/* HERO SECTION */}
                <motion.section 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-10%" }}
                    variants={fadeUpVariant}
                >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                        {/* Left: Headline */}
                        <div className="w-full lg:col-span-7 xl:col-span-8">
                            <h1 
                                className="font-sans font-[800] uppercase leading-[0.95] break-words"
                                style={{ fontSize: 'clamp(44px, 6vw, 92px)', wordBreak: 'break-word' }}
                            >
                                {hiringData.titleLine1 || "I'M HIRING A"}<br />
                                <span className="text-[#E8A020] block my-2">{hiringData.titleLine2 || "CINEMATIC STORYTELLER/EDITOR"}</span>
                                {hiringData.titleLine3 || "TO JOIN THE TEAM."}
                            </h1>
                        </div>
                        
                        {/* Right: Portrait Placeholder */}
                        <div className="w-full lg:col-span-5 xl:col-span-4 shrink-0 min-w-0">
                            <div className={`${glassCard} flex items-center justify-center relative overflow-hidden aspect-[16/9] lg:aspect-[3/4] w-full lg:max-h-[460px] rounded-[16px] xl:rounded-[20px] bg-black`}>
                                {hiringData.heroImage ? (
                                    <img src={hiringData.heroImage} alt="Hero" className="absolute inset-0 w-full h-full object-cover rounded-[inherit]" />
                                ) : (
                                    <span className="font-admin text-[11px] uppercase tracking-[0.15em] text-[#F5F5F7] opacity-25">
                                        [ YOUR PHOTO ]
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* INTRO BLOCK */}
                    <div className="border-t border-white/[0.07] my-[48px]" />
                    
                    <div className="max-w-[580px] space-y-6">
                        <p className="font-sans font-[400] text-[17px] leading-[1.75] text-[#F5F5F7]/85">
                            {hiringData.introParagraph1} {hiringData.introParagraph2}
                        </p>
                        <blockquote 
                            className={`bg-white/[0.04] backdrop-blur-[24px] border border-white/[0.09] rounded-[16px] px-[24px] py-[20px] font-sans font-[400] italic text-[17px] leading-[1.6] text-[#F5F5F7]/90 border-l-[3px] !border-l-[#7EB8D4]`}
                            style={{ boxShadow: '0 0 32px rgba(126,184,212,0.06)' }}
                        >
                            {hiringData.introParagraph3 || "If your edits feel like short films instead of 'content', send your work."}
                        </blockquote>
                    </div>
                </motion.section>

                <div className="mb-[52px] md:mb-[72px]" />

                {/* MUST BE ABLE TO */}
                <motion.section 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-10%" }}
                    variants={staggerContainer}
                    className="max-w-[800px]"
                >
                    <motion.h2 
                        variants={fadeUpVariant}
                        className="font-admin text-[11px] uppercase tracking-[0.18em] text-[#F5F5F7]/60 mb-[40px] flex items-center gap-2"
                    >
                        <span className="text-[#E8A020]">●</span> Must be able to
                    </motion.h2>
                    <div className="space-y-[16px]">
                        {hiringData.roleRequirements.map((req, i) => (
                            <motion.div 
                                key={i} 
                                variants={fadeUpVariant}
                                className="flex items-center bg-[#0C0C0C] border border-white/[0.04] rounded-[16px] px-[24px] py-[20px] transition-all duration-300 hover:border-white/[0.08] hover:bg-[#111111] relative overflow-hidden"
                            >
                                <div className="absolute left-0 top-[10%] bottom-[10%] w-[4px] bg-[#E8A020] rounded-r-full opacity-60"></div>
                                <p className="font-sans font-[400] text-[16px] md:text-[18px] leading-[1.4] text-[#F5F5F7]">
                                    {req}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                <div className="mb-[52px] md:mb-[72px]" />

                {/* THE KIND OF WORK WE MAKE */}
                <motion.section 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-10%" }}
                    variants={staggerCards}
                >
                    <motion.h2 
                        variants={fadeUpVariant}
                        className="font-admin text-[11px] uppercase tracking-[0.18em] text-[#F5F5F7]/60 mb-[28px] flex items-center gap-2"
                    >
                        <span className="text-[#E8A020]">●</span> The kind of work we make
                    </motion.h2>

                    <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-[16px] pb-[16px] md:pb-0 snap-x snap-mandatory hide-scrollbars">
                        
                        {/* Card 1 */}
                        <motion.div 
                            variants={fadeUpVariant}
                            className={`shrink-0 w-[80vw] md:w-auto snap-start ${glassCard} ${glassCardHover} hover:shadow-[0_8px_48px_rgba(0,0,0,0.5),_0_0_60px_rgba(232,160,32,0.05)] flex flex-col overflow-hidden`}
                        >
                            <div className="w-full aspect-[16/9] bg-white/[0.03] border-b border-white/[0.06] flex items-center justify-center relative bg-black">
                                {hiringData.card1Media ? (
                                    <img src={hiringData.card1Media} alt="Travel Films" className="absolute inset-0 w-full h-full object-cover" />
                                ) : (
                                    <span className="font-admin text-[11px] uppercase tracking-[0.15em] text-[#F5F5F7] opacity-20">
                                        [ EXAMPLE EDIT ]
                                    </span>
                                )}
                            </div>
                            <div className="p-[20px]">
                                <h3 className="font-sans font-[700] uppercase tracking-[0.12em] text-[12px] text-[#E8A020] mb-[8px]">Travel Films</h3>
                                <p className="font-sans font-[400] text-[13px] leading-[1.6] text-[#F5F5F7]/50">
                                    Cinematic long-form docs. Slow burn. Emotional payoff.
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 2 */}
                        <motion.div 
                            variants={fadeUpVariant}
                            className={`shrink-0 w-[80vw] md:w-auto snap-start ${glassCard} ${glassCardHover} hover:shadow-[0_8px_48px_rgba(0,0,0,0.5),_0_0_60px_rgba(255,107,53,0.05)] flex flex-col overflow-hidden`}
                        >
                            <div className="w-full aspect-[16/9] bg-white/[0.03] border-b border-white/[0.06] flex items-center justify-center relative bg-black">
                                {hiringData.card2Media ? (
                                    <img src={hiringData.card2Media} alt="Reels" className="absolute inset-0 w-full h-full object-cover" />
                                ) : (
                                    <span className="font-admin text-[11px] uppercase tracking-[0.15em] text-[#F5F5F7] opacity-20">
                                        [ EXAMPLE EDIT ]
                                    </span>
                                )}
                            </div>
                            <div className="p-[20px]">
                                <h3 className="font-sans font-[700] uppercase tracking-[0.12em] text-[12px] text-[#FF6B35] mb-[8px]">Reels</h3>
                                <p className="font-sans font-[400] text-[13px] leading-[1.6] text-[#F5F5F7]/50">
                                    Punchy. Story-first. Never just a highlight reel.
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 3 */}
                        <motion.div 
                            variants={fadeUpVariant}
                            className={`shrink-0 w-[80vw] md:w-auto snap-start ${glassCard} ${glassCardHover} hover:shadow-[0_8px_48px_rgba(0,0,0,0.5),_0_0_60px_rgba(126,184,212,0.05)] flex flex-col overflow-hidden`}
                        >
                            <div className="w-full aspect-[16/9] bg-white/[0.03] border-b border-white/[0.06] flex items-center justify-center relative bg-black">
                                {hiringData.card3Media ? (
                                    <img src={hiringData.card3Media} alt="Documentary" className="absolute inset-0 w-full h-full object-cover" />
                                ) : (
                                    <span className="font-admin text-[11px] uppercase tracking-[0.15em] text-[#F5F5F7] opacity-20">
                                        [ EXAMPLE EDIT ]
                                    </span>
                                )}
                            </div>
                            <div className="p-[20px]">
                                <h3 className="font-sans font-[700] uppercase tracking-[0.12em] text-[12px] text-[#7EB8D4] mb-[8px]">Documentary</h3>
                                <p className="font-sans font-[400] text-[13px] leading-[1.6] text-[#F5F5F7]/50">
                                    Real people, real moments. No polish over truth.
                                </p>
                            </div>
                        </motion.div>

                    </div>
                    <style>{`
                        .hide-scrollbars::-webkit-scrollbar { display: none; }
                        .hide-scrollbars { -ms-overflow-style: none; scrollbar-width: none; }
                    `}</style>
                </motion.section>

                <div className="mb-[52px] md:mb-[72px]" />

                {/* WHAT MAKES A GREAT APPLICANT */}
                <motion.section 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-10%" }}
                    variants={fadeUpVariant}
                >
                    <h2 className="font-admin text-[11px] uppercase tracking-[0.18em] text-[#F5F5F7]/60 mb-[28px] flex items-center gap-2">
                        <span className="text-[#E8A020]">●</span> What makes a great applicant
                    </h2>
                    <div 
                        className={glassCard}
                        style={{ padding: '32px', boxShadow: '0 0 60px rgba(232,160,32,0.05)' }}
                    >
                        <p className="font-sans font-[400] text-[15px] leading-[1.8] text-[#F5F5F7]/80 whitespace-pre-wrap">
                            {hiringData.applicantParagraph}
                        </p>
                    </div>
                </motion.section>

                <div className="mb-[52px] md:mb-[72px]" />

                {/* THE PROCESS */}
                <motion.section 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-10%" }}
                    variants={staggerContainer}
                >
                    <h2 className="font-admin text-[11px] uppercase tracking-[0.18em] text-[#F5F5F7]/60 mb-[28px] flex items-center gap-2">
                        <span className="text-[#E8A020]">●</span> The Process
                    </h2>
                    
                    <div className="space-y-[12px]">
                        {hiringData.processSteps.map((step, i) => (
                            <motion.div 
                                key={i}
                                variants={fadeUpVariant}
                                className={`${glassCard} flex items-center gap-[28px] px-[20px] py-[20px] md:px-[28px] md:py-[24px] rounded-[16px]`}
                            >
                                <span 
                                    className="font-sans font-[800] leading-none min-w-[56px] text-[48px] md:text-[64px]"
                                    style={{ 
                                        color: i === 0 ? '#E8A020' : i === 1 ? 'rgba(232,160,32,0.6)' : 'rgba(232,160,32,0.4)' 
                                    }}
                                >
                                    {i + 1}
                                </span>
                                <p className="font-sans font-[400] text-[15px] leading-[1.6] text-[#F5F5F7]">
                                    {step}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* CTA SECTION */}
                <motion.section 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-10%" }}
                    variants={fadeUpVariant}
                    className="py-[64px] text-center"
                >
                    <div className="border-t border-white/[0.07] mb-[64px]" />
                    
                    <h2 className="font-sans font-[800] text-[38px] uppercase tracking-[-0.01em] mb-[12px]">
                        Ready to cut?
                    </h2>
                    <p className="font-admin text-[13px] opacity-35 mb-[36px]">
                        No rush. Take your time, show your skills.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-[14px] flex-wrap">
                        <a 
                            href={hiringData.callToActionURL}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-[#E8A020] text-[#050505] font-sans font-[700] text-[13px] uppercase tracking-[0.1em] px-[36px] py-[15px] rounded-[14px] hover:bg-[#FF6B35] transition-all duration-250 ease-out shadow-[0_4px_24px_rgba(232,160,32,0.25)] w-full sm:w-auto"
                        >
                            Download Footage
                        </a>
                        <button 
                            onClick={() => alert("Upload form configuration required.")}
                            className={`bg-white/[0.04] backdrop-blur-[24px] border border-white/[0.09] shadow-[0_4px_40px_rgba(0,0,0,0.4)] text-[#F5F5F7] font-sans font-[700] text-[13px] uppercase tracking-[0.1em] px-[36px] py-[15px] rounded-[14px] hover:bg-white/[0.07] hover:border-white/25 transition-all duration-250 ease-out w-full sm:w-auto`}
                        >
                            Submit Your Edit
                        </button>
                    </div>
                </motion.section>
                
            </div>
        </div>
    );
};

export default Hiring;


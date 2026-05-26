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
        <div className="min-h-screen bg-[#050505] text-[#F5F5F7] selection:bg-[#E8A020] selection:text-black overflow-hidden border-box">
            
            {/* HERO SECTION */}
            <motion.section 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-10%" }}
                variants={fadeUpVariant}
                className="relative w-full min-h-[90vh] bg-[#050505]"
            >
                {/* PHOTO (Right align desktop, full cover mobile) */}
                {hiringData.heroImage ? (
                    <img 
                        src={hiringData.heroImage} 
                        alt="Hero" 
                        className="absolute top-0 right-0 h-full w-full md:w-[55%] object-cover object-top" 
                    />
                ) : (
                    <div className="absolute top-0 right-0 h-full w-full md:w-[55%] bg-[#0F0F11] flex items-center justify-center border-l border-white/5">
                        <span className="font-admin text-[11px] uppercase tracking-[0.15em] text-[#F5F5F7] opacity-25">
                            [ YOUR PHOTO ]
                        </span>
                    </div>
                )}

                {/* Desktop Gradient */}
                <div 
                    className="absolute inset-0 hidden md:block pointer-events-none" 
                    style={{
                        background: `linear-gradient(to right, #050505 0%, #050505 46%, rgba(5,5,5,0.9) 52%, rgba(5,5,5,0.4) 70%, rgba(5,5,5,0) 100%)`
                    }}
                />

                {/* Mobile Gradient */}
                <div 
                    className="absolute inset-0 block md:hidden pointer-events-none" 
                    style={{
                        background: `linear-gradient(to right, #050505 0%, rgba(5,5,5,0.85) 40%, rgba(5,5,5,0.4) 100%)`
                    }}
                />

                {/* Bottom Fade */}
                <div 
                    className="absolute bottom-0 left-0 right-0 h-[200px] z-[5] pointer-events-none" 
                    style={{ background: 'linear-gradient(to top, #050505, transparent)' }} 
                />

                {/* HEADLINE */}
                <style>{`
                    .hero-headline {
                        font-size: clamp(40px, 9vw, 64px);
                    }
                    @media (min-width: 768px) {
                        .hero-headline {
                            font-size: clamp(44px, 6.5vw, 90px);
                        }
                    }
                `}</style>
                <div className="absolute inset-0 flex flex-col justify-center z-10 box-border" style={{ paddingLeft: 'clamp(24px, 5vw, 80px)' }}>
                    <div className="w-[85%] md:w-[55%]">
                        <h1 className="hero-headline font-sans font-[800] uppercase leading-[0.95] break-words">
                            <span className="text-[#F5F5F7] block">{hiringData.titleLine1 || "I'M HIRING A"}</span>
                            <span className="text-[#E8A020] block">{hiringData.titleLine2 || "CINEMATIC EDITOR"}</span>
                            <span className="text-[#F5F5F7] block">{hiringData.titleLine3 || "TO JOIN THE TEAM."}</span>
                        </h1>
                    </div>
                </div>
            </motion.section>

            <div className="max-w-[1140px] mx-auto px-[24px] lg:px-[48px] pb-32 pt-8">
                
                <motion.section
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-10%" }}
                    variants={fadeUpVariant}
                >
                    {/* INTRO BLOCK */}
                    <div className="border-t border-white/[0.07] mb-[48px] max-w-[800px] mx-auto" />
                    
                    <div className="max-w-[800px] mx-auto space-y-6 text-center">
                        <div className="font-sans font-[400] text-[17px] leading-[1.75] text-[#F5F5F7]/85 space-y-4 [&_a]:text-[#E8A020] [&_a]:underline [&_a]:decoration-white/30 hover:[&_a]:decoration-[#E8A020]">
                            <div dangerouslySetInnerHTML={{ __html: hiringData.introParagraph1 }} />
                            <div dangerouslySetInnerHTML={{ __html: hiringData.introParagraph2 }} />
                        </div>
                        <blockquote 
                            className={`bg-white/[0.04] backdrop-blur-[24px] border border-white/[0.09] rounded-[16px] px-[24px] py-[20px] font-sans font-[400] italic text-[17px] leading-[1.6] text-[#F5F5F7]/90 border-l-[3px] !border-l-[#7EB8D4] text-left md:text-center md:border-l-0 md:border-t-[3px] md:!border-t-[#7EB8D4] [&_a]:text-[#7EB8D4] [&_a]:underline hover:[&_a]:decoration-[#7EB8D4]`}
                            style={{ boxShadow: '0 0 32px rgba(126,184,212,0.06)' }}
                        >
                            {hiringData.introParagraph3 ? (
                                <div dangerouslySetInnerHTML={{ __html: hiringData.introParagraph3 }} />
                            ) : (
                                "If your edits feel like short films instead of 'content', send your work."
                            )}
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
                    className="max-w-[800px] mx-auto"
                >
                    <motion.h2 
                        variants={fadeUpVariant}
                        className="font-admin text-[11px] uppercase tracking-[0.18em] text-[#F5F5F7]/60 mb-[40px] flex items-center justify-center gap-2"
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
                    className="max-w-[1140px] mx-auto"
                >
                    <motion.h2 
                        variants={fadeUpVariant}
                        className="font-admin text-[11px] uppercase tracking-[0.18em] text-[#F5F5F7]/60 mb-[28px] flex items-center justify-center gap-2"
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
                    className="max-w-[800px] mx-auto"
                >
                    <h2 className="font-admin text-[11px] uppercase tracking-[0.18em] text-[#F5F5F7]/60 mb-[28px] flex items-center justify-center gap-2">
                        <span className="text-[#E8A020]">●</span> What makes a great applicant
                    </h2>
                    <div 
                        className={glassCard}
                        style={{ padding: '32px', boxShadow: '0 0 60px rgba(232,160,32,0.05)' }}
                    >
                        <div 
                            className="font-sans font-[400] text-[15px] leading-[1.8] text-[#F5F5F7]/80 text-center space-y-4 [&_a]:text-[#E8A020] [&_a]:underline [&_a]:decoration-[#E8A020]/30 hover:[&_a]:decoration-[#E8A020]"
                            dangerouslySetInnerHTML={{ __html: hiringData.applicantParagraph }} 
                        />
                    </div>
                </motion.section>

                <div className="mb-[52px] md:mb-[72px]" />

                {/* THE PROCESS */}
                <motion.section 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-10%" }}
                    variants={staggerContainer}
                    className="max-w-[800px] mx-auto"
                >
                    <h2 className="font-admin text-[11px] uppercase tracking-[0.18em] text-[#F5F5F7]/60 mb-[28px] flex items-center justify-center gap-2">
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
                        {hiringData.cta1Label && (
                            <a 
                                href={hiringData.cta1URL || hiringData.callToActionURL || '#'}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#050505] font-sans font-[700] text-[13px] uppercase tracking-[0.1em] px-[36px] py-[15px] rounded-[14px] hover:brightness-110 transition-all duration-250 ease-out shadow-[0_4px_24px_rgba(232,160,32,0.15)] w-full sm:w-auto"
                                style={{ backgroundColor: hiringData.cta1Color || '#E8A020' }}
                            >
                                {hiringData.cta1Label}
                            </a>
                        )}
                        {hiringData.cta2Label && (
                            <a 
                                href={hiringData.cta2URL || '#'}
                                target={hiringData.cta2URL ? "_blank" : "_self"}
                                rel="noreferrer"
                                onClick={(e) => {
                                    if (!hiringData.cta2URL) {
                                        e.preventDefault();
                                        alert("Upload form configuration required.");
                                    }
                                }}
                                className={`bg-white/[0.04] backdrop-blur-[24px] border border-white/[0.09] shadow-[0_4px_40px_rgba(0,0,0,0.4)] text-[#F5F5F7] font-sans font-[700] text-[13px] uppercase tracking-[0.1em] px-[36px] py-[15px] rounded-[14px] hover:bg-white/[0.07] hover:border-white/25 transition-all duration-250 ease-out w-full sm:w-auto`}
                            >
                                {hiringData.cta2Label}
                            </a>
                        )}
                    </div>
                </motion.section>
                
            </div>
        </div>
    );
};

export default Hiring;


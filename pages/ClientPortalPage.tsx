import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { Shield, ArrowRight, Download } from 'lucide-react';

export const ClientPortalPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { clientPortals, isLoading } = useContent();
  const navigate = useNavigate();

  const [passcodeAttempt, setPasscodeAttempt] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [revealPortal, setRevealPortal] = useState(false);

  // Find corresponding portal by slug
  const portal = clientPortals.find(p => p.slug === slug);

  useEffect(() => {
    if (!isLoading && !portal) {
      // If portal doesn't exist, redirect to home page after a brief moment
      const timer = setTimeout(() => navigate('/'), 3000);
      return () => clearTimeout(timer);
    }
  }, [portal, isLoading, navigate]);

  useEffect(() => {
    if (portal) {
      // Check if passcode is empty/null, or if already unlocked in session storage
      const hasPasscode = portal.passcode && portal.passcode.trim() !== '';
      const isAlreadyUnlocked = sessionStorage.getItem(`portal_unlocked_${portal.id}`) === 'true';

      if (!hasPasscode || isAlreadyUnlocked) {
        setIsUnlocked(true);
        // Add a gentle delay to trigger the fade-in animation
        setTimeout(() => setRevealPortal(true), 100);
      }
    }
  }, [portal]);

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!portal) return;

    if (passcodeAttempt === portal.passcode) {
      setErrorMsg('');
      sessionStorage.setItem(`portal_unlocked_${portal.id}`, 'true');
      setIsUnlocked(true);
      setTimeout(() => setRevealPortal(true), 100);
    } else {
      setErrorMsg('Incorrect passcode');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#F0EDE8] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs uppercase tracking-widest text-[#F0EDE8]/40 font-mono">Securing Connection...</p>
        </div>
      </div>
    );
  }

  if (!portal) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#F0EDE8] flex flex-col items-center justify-center font-sans p-6 text-center">
        <h1 className="text-4xl font-light font-serif tracking-tight text-[#C9A96E] mb-4">404</h1>
        <p className="text-lg font-serif italic text-[#F0EDE8]/70 max-w-md mb-8">This private delivery workspace could not be found or has expired.</p>
        <p className="text-xs uppercase tracking-widest text-[#F0EDE8]/40 font-mono">Redirecting to Mavestone Media...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F0EDE8] relative overflow-hidden selection:bg-[#C9A96E]/20 selection:text-white">
      {/* Dynamic grain overlay */}
      <div className="fixed inset-[-80px] pointer-events-none opacity-[0.035] mix-blend-screen bg-repeat z-50 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22140%22 height=%22140%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')] bg-[size:160px_160px] animate-[noise_1.6s_steps(3)_infinite]"></div>

      {/* LOCK SCREEN PASSCODE GATE */}
      {!isUnlocked && (
        <div className="min-h-screen flex items-center justify-center p-6 relative z-10 bg-[#0A0A0A]">
          <div className="max-w-sm w-full space-y-10 text-center">
            {/* Logo Wordmark */}
            <div className="space-y-1">
              <h2 className="text-[28px] sm:text-[34px] font-extralight tracking-[0.2em] uppercase font-serif text-[#F0EDE8] leading-tight">
                Mavestone
              </h2>
              <p className="text-[10px] uppercase tracking-[0.4em] text-[#C9A96E] font-sans font-light">
                Media
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleVerifyPasscode} className="space-y-6">
              <div className="space-y-2 text-center">
                <p className="text-xs uppercase tracking-[0.2em] text-[#F0EDE8]/40 font-mono">Private Access Only</p>
                {portal.clientName && (
                  <p className="text-sm italic font-serif text-[#F0EDE8]/70">Delivery portal for {portal.clientName}</p>
                )}
              </div>

              <div className={`relative transition-transform duration-300 ${isShaking ? 'animate-[shake_0.4s_ease-in-out]' : ''}`}>
                <input
                  type="password"
                  placeholder="Enter Passcode"
                  value={passcodeAttempt}
                  onChange={(e) => {
                    setPasscodeAttempt(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="w-full bg-[#111111]/80 border border-[#C9A96E]/20 hover:border-[#C9A96E]/40 focus:border-[#C9A96E] rounded-none py-3.5 px-5 text-center text-sm text-[#F0EDE8] placeholder-[#F0EDE8]/30 tracking-widest focus:outline-none transition-all font-mono"
                  autoFocus
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-red-400/80 tracking-widest uppercase font-mono animate-fade-in">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full group bg-transparent border border-[#C9A96E] text-[#C9A96E] hover:bg-[#C9A96E] hover:text-[#0A0A0A] font-sans text-xs uppercase tracking-[0.2em] py-3.5 px-8 transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <span>Access Workspace</span>
                <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* PORTAL CONTENT */}
      {isUnlocked && (
        <div className={`transition-all duration-1000 ease-out transform ${revealPortal ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          
          {/* HEADER */}
          <header className="max-w-7xl mx-auto px-6 sm:px-12 py-8 flex items-center justify-between border-b border-[#F0EDE8]/10 relative z-10">
            <div className="flex flex-col">
              <span className="font-serif italic text-base sm:text-lg text-[#C9A96E] tracking-tight">
                Mavestone Media
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#F0EDE8]/30 font-sans mt-0.5">
                Client Workspace
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#C9A96E]/60 text-[10px] uppercase tracking-widest font-mono">
              <Shield size={10} />
              <span>Secure Link</span>
            </div>
          </header>

          <main className="max-w-4xl mx-auto px-6 sm:px-12 py-16 sm:py-24 relative z-10 space-y-16 sm:space-y-24">
            
            {/* HERO SECTION */}
            <section className="space-y-6">
              <div className="flex items-center justify-between gap-4 text-xs font-mono uppercase tracking-[0.15em] text-[#F0EDE8]/40">
                <span>Client: {portal.clientName}</span>
                <span>{portal.deliveryDate}</span>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-6xl font-light font-serif tracking-tight text-[#F0EDE8] leading-tight">
                  {portal.projectTitle}
                </h1>
                <div className="h-[1px] w-full bg-gradient-to-r from-[#C9A96E] via-[#C9A96E]/20 to-transparent"></div>
              </div>

              {portal.message && (
                <div className="pt-4 max-w-xl">
                  <p className="font-serif italic text-lg sm:text-xl text-[#F0EDE8]/80 leading-relaxed font-light text-glow">
                    "{portal.message}"
                  </p>
                  <p className="font-serif italic text-sm text-[#C9A96E] mt-3">
                    — Mavestone Media
                  </p>
                </div>
              )}
            </section>

            {/* VIDEOS SECTION */}
            <section className="space-y-16">
              {portal.videos && portal.videos.length > 0 ? (
                portal.videos.map((video, index) => (
                  <div key={index} className="space-y-4 group">
                    {/* Video Header info */}
                    <div className="flex items-baseline justify-between border-b border-[#F0EDE8]/5 pb-3">
                      <h3 className="font-serif text-xl sm:text-2xl font-light text-[#F0EDE8] group-hover:text-[#C9A96E] transition-colors duration-300">
                        {video.title}
                      </h3>
                      <span className="font-mono text-xs text-[#F0EDE8]/40 uppercase tracking-wider">
                        {video.duration}
                      </span>
                    </div>

                    {/* Vimeo Video Embed Container */}
                    <div className="video-container relative aspect-video bg-[#111111] overflow-hidden border border-[#F0EDE8]/5 hover:border-[#C9A96E]/30 transition-all duration-300 shadow-2xl">
                      {video.vimeoId ? (
                        <iframe
                          src={`https://player.vimeo.com/video/${video.vimeoId}?color=C9A96E&title=0&byline=0&portrait=0&badge=0`}
                          className="absolute inset-0 w-full h-full"
                          frameBorder="0"
                          allow="autoplay; fullscreen; picture-in-picture"
                          allowFullScreen
                          title={video.title}
                        ></iframe>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-[#F0EDE8]/30 space-y-2 font-mono text-xs">
                          <p>VIMEO ID NOT CONFIGURED</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 border border-dashed border-[#C9A96E]/20 rounded p-6">
                  <p className="font-serif italic text-base text-[#F0EDE8]/50">No delivery films loaded yet.</p>
                </div>
              )}
            </section>

            {/* DOWNLOAD SECTION */}
            {portal.downloadLink && portal.downloadLink.trim() !== '' && (
              <section className="pt-8 sm:pt-12">
                <div className="border border-[#C9A96E]/30 bg-[#111111]/40 p-8 sm:p-10 text-center space-y-6 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A96E]/50 to-transparent"></div>
                  <div className="max-w-md mx-auto space-y-3">
                    <h3 className="font-serif text-2xl font-light text-[#C9A96E]">
                      Master Deliverables
                    </h3>
                    <p className="text-sm font-sans text-[#F0EDE8]/60 leading-relaxed">
                      Access high-bitrate ProRes masters and distribution formats. Your source media will remain hosted and accessible at this secure archive.
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <a
                      href={portal.downloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 bg-[#C9A96E] text-[#0A0A0A] hover:bg-white hover:text-[#0A0A0A] font-sans text-xs uppercase tracking-[0.2em] font-medium py-4 px-8 transition-all duration-300 shadow-xl hover:shadow-[#C9A96E]/10"
                    >
                      <Download size={14} />
                      <span>Download Archive</span>
                    </a>
                  </div>
                </div>
              </section>
            )}

          </main>

          {/* PORTAL FOOTER */}
          <footer className="py-16 text-center text-[10px] uppercase tracking-[0.3em] text-[#F0EDE8]/20 relative z-10">
            <span>© {new Date().getFullYear()} Mavestone Media · All Rights Reserved</span>
          </footer>
        </div>
      )}

      {/* Shaking & noise custom animations inside style block */}
      <style>{`
        @keyframes noise {
          0%, 100% { transform:translate(0, 0); }
          10% { transform:translate(-1%, -2%); }
          30% { transform:translate(-2%, 1%); }
          50% { transform:translate(2%, 3%); }
          70% { transform:translate(1%, -3%); }
          90% { transform:translate(-2%, 2%); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
};

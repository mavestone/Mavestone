import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { Shield, ArrowRight, Download, Facebook, Twitter, MessageCircle, Mail, Link as LinkIcon, Check } from 'lucide-react';

export const ClientPortalPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { clientPortals, isLoading } = useContent();
  const navigate = useNavigate();

  const [passcodeAttempt, setPasscodeAttempt] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [revealPortal, setRevealPortal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Find corresponding portal by slug
  const portal = clientPortals.find(p => p.slug === slug);
  const shareUrl = window.location.href;

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

  useEffect(() => {
    if (portal) {
      const firstVideoTitle = portal.videos && portal.videos.length > 0 ? portal.videos[0].title : portal.projectTitle;
      
      // Set page title dynamically
      document.title = `${firstVideoTitle} — ${portal.clientName} | Mavestone`;

      // Dynamically manage OpenGraph social share meta tags
      let metaOgImage = document.querySelector('meta[property="og:image"]');
      if (!metaOgImage) {
        metaOgImage = document.createElement('meta');
        metaOgImage.setAttribute('property', 'og:image');
        document.head.appendChild(metaOgImage);
      }
      metaOgImage.setAttribute('content', 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&h=630&q=80');

      let metaOgTitle = document.querySelector('meta[property="og:title"]');
      if (!metaOgTitle) {
        metaOgTitle = document.createElement('meta');
        metaOgTitle.setAttribute('property', 'og:title');
        document.head.appendChild(metaOgTitle);
      }
      metaOgTitle.setAttribute('content', `${firstVideoTitle} — Delivered by Mavestone`);

      let metaOgDesc = document.querySelector('meta[property="og:description"]');
      if (!metaOgDesc) {
        metaOgDesc = document.createElement('meta');
        metaOgDesc.setAttribute('property', 'og:description');
        document.head.appendChild(metaOgDesc);
      }
      metaOgDesc.setAttribute('content', portal.message || `Secure client delivery portal for ${portal.clientName}.`);
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isClean = portal?.stylingType === 'clean';
  const isDark = portal?.themeMode === 'dark' || (portal?.themeMode !== 'light' && isClean);

  // Define styling variables based on theme
  const styles = {
    bg: isDark ? 'bg-[#050505]' : 'bg-[#FAF9F6]',
    text: isDark ? 'text-[#F5F5F7]' : 'text-[#1A1A1A]',
    textMuted: isDark ? 'text-white/40' : 'text-[#1A1A1A]/40',
    textBodyMuted: isDark ? 'text-white/60' : 'text-[#1A1A1A]/70',
    textMainMuted: isDark ? 'text-white/80' : 'text-[#1A1A1A]/80',
    border: isDark ? 'border-white/10' : 'border-[#1A1A1A]/10',
    borderLight: isDark ? 'border-white/5' : 'border-[#1A1A1A]/5',
    logoText: isDark ? 'text-white' : 'text-[#1A1A1A]',
    fontDisplay: isClean ? 'font-manrope font-bold' : 'font-light font-serif',
    fontBody: isClean ? 'font-sans' : 'font-serif',
    rounded: isClean ? 'rounded-xl' : 'rounded-none',
    button: isClean 
      ? (isDark ? 'bg-[#C9A96E] hover:bg-white text-black font-semibold rounded-xl' : 'bg-[#1A1A1A] hover:bg-[#C9A96E] text-white font-semibold rounded-xl')
      : (isDark ? 'bg-[#C9A96E] hover:bg-white text-black rounded-none' : 'bg-[#1A1A1A] hover:bg-[#C9A96E] text-white rounded-none'),
    input: isDark
      ? (isClean 
          ? 'bg-white/5 border border-white/15 focus:border-[#C9A96E] text-white placeholder-white/30 rounded-xl font-sans'
          : 'bg-white/5 border border-white/15 focus:border-[#C9A96E] text-white placeholder-white/30 rounded-none font-mono')
      : (isClean
          ? 'bg-white border border-[#1A1A1A]/10 focus:border-[#C9A96E] text-[#1A1A1A] placeholder-[#1A1A1A]/30 rounded-xl font-sans'
          : 'bg-white border border-[#C9A96E]/20 focus:border-[#C9A96E] text-[#1A1A1A] placeholder-[#1A1A1A]/30 rounded-none font-mono'),
    cardBg: isDark 
      ? (isClean ? 'bg-white/5 border border-white/10' : 'bg-white/5 border border-[#C9A96E]/30')
      : (isClean ? 'bg-white border border-black/5' : 'bg-white border-[#C9A96E]/30'),
    downloadBtn: isDark
      ? (isClean ? 'bg-white text-black hover:bg-[#C9A96E] hover:text-white rounded-xl' : 'bg-[#C9A96E] text-black hover:bg-white rounded-none')
      : (isClean ? 'bg-[#1A1A1A] text-white hover:bg-[#C9A96E] rounded-xl' : 'bg-[#1A1A1A] text-white hover:bg-[#C9A96E] hover:text-white rounded-none'),
    shareBtn: isDark
      ? 'bg-white/5 border border-white/10 text-white hover:border-[#C9A96E] hover:text-[#C9A96E] rounded-full'
      : 'bg-white border border-black/5 text-[#1A1A1A] hover:border-[#C9A96E] hover:text-[#C9A96E] rounded-full',
    grainOpacity: isDark ? 'opacity-[0.025]' : 'opacity-[0.045]',
    grainBlend: isDark ? 'mix-blend-screen' : 'mix-blend-multiply',
  };

  if (isLoading) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-[#050505] text-[#F5F5F7]' : 'bg-[#FAF9F6] text-[#1A1A1A]'} flex items-center justify-center font-sans`}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#C9A96E] border-t-transparent rounded-full animate-spin"></div>
          <p className={`text-xs uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-[#1A1A1A]/40'} font-mono`}>Securing Connection...</p>
        </div>
      </div>
    );
  }

  if (!portal) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#F5F5F7] flex flex-col items-center justify-center font-sans p-6 text-center">
        <h1 className="text-4xl font-light font-serif tracking-tight text-[#C9A96E] mb-4">404</h1>
        <p className="text-lg font-serif italic text-white/70 max-w-md mb-8">This private delivery workspace could not be found or has expired.</p>
        <p className="text-xs uppercase tracking-widest text-white/40 font-mono">Redirecting to Mavestone...</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${styles.bg} ${styles.text} relative overflow-hidden selection:bg-[#C9A96E]/20 selection:text-black`}>
      {/* Dynamic grain overlay for premium organic film texture */}
      <div className={`fixed inset-[-80px] pointer-events-none ${styles.grainOpacity} ${styles.grainBlend} bg-repeat z-50 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22140%22 height=%22140%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%222%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/></svg>')] bg-[size:160px_160px] animate-[noise_1.6s_steps(3)_infinite]`}></div>

      {/* LOCK SCREEN PASSCODE GATE */}
      {!isUnlocked && (
        <div className={`min-h-screen flex items-center justify-center p-6 relative z-10 ${styles.bg}`}>
          <div className="max-w-sm w-full space-y-10 text-center">
            {/* Logo Wordmark */}
            <div className="space-y-1">
              <h2 className={`text-[34px] font-bold tracking-tighter ${styles.logoText} font-manrope leading-tight`}>
                Mavestone<span className="text-[#C9A96E]">.</span>
              </h2>
              <p className={`text-[10px] uppercase tracking-[0.25em] ${styles.textMuted} font-sans font-medium`}>
                Private Delivery Portal
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleVerifyPasscode} className="space-y-6">
              <div className="space-y-2 text-center">
                <p className={`text-xs uppercase tracking-[0.2em] ${styles.textMuted} font-mono`}>Private Access Only</p>
                {portal.clientName && (
                  <p className={`text-sm ${isClean ? 'text-white/70' : 'italic font-serif text-[#1A1A1A]/70'}`}>Delivery portal for {portal.clientName}</p>
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
                  className={`w-full py-3.5 px-5 text-center text-sm focus:outline-none transition-all ${styles.input}`}
                  autoFocus
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-red-500/80 tracking-widest uppercase font-mono animate-fade-in">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className={`w-full group font-sans text-xs uppercase tracking-[0.2em] py-3.5 px-8 transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] shadow-sm hover:shadow-md ${styles.button}`}
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
          <header className={`max-w-7xl mx-auto px-6 sm:px-12 py-8 flex items-center justify-between border-b ${styles.border} relative z-10`}>
            <div className="flex items-center gap-2.5">
              <Shield size={14} className="text-[#C9A96E]" />
              <div className="flex flex-col">
                <span className={`text-[10px] font-bold uppercase tracking-[0.25em] ${isClean ? 'text-white/80' : 'text-[#1A1A1A]/80'} font-sans`}>
                  Client Workspace
                </span>
                <span className={`text-[8px] uppercase tracking-[0.2em] ${styles.textMuted} font-mono mt-0.5`}>
                  Secure Delivery Portal
                </span>
              </div>
            </div>
            
            <a href="/" className={`text-xl font-bold tracking-tighter ${styles.logoText} cursor-pointer hover:opacity-80 transition-opacity font-manrope select-none`}>
              Mavestone<span className="text-[#C9A96E]">.</span>
            </a>
          </header>

          <main className="max-w-4xl mx-auto px-6 sm:px-12 py-16 sm:py-24 relative z-10 space-y-16 sm:space-y-24">
            
            {/* HERO SECTION */}
            <section className="space-y-6">
              <div className={`flex items-center justify-end gap-4 text-xs font-mono uppercase tracking-[0.15em] ${styles.textMuted}`}>
                <span>{portal.deliveryDate}</span>
              </div>
              
              <div className="space-y-2">
                <h1 className={`text-4xl sm:text-6xl ${styles.fontDisplay} tracking-tight leading-tight`}>
                  {portal.projectTitle}
                </h1>
                <div className="h-[1px] w-full bg-gradient-to-r from-[#C9A96E] via-[#C9A96E]/20 to-transparent"></div>
              </div>

              {portal.message && (
                <div className="pt-4 max-w-xl">
                  <p className={`text-lg sm:text-xl ${isClean ? styles.textMainMuted + ' font-light' : 'font-serif italic text-[#1A1A1A]/80 font-light'} leading-relaxed`}>
                    "{portal.message}"
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
                    <div className={`flex items-baseline justify-between border-b ${styles.borderLight} pb-3`}>
                      <h3 className={`text-xl sm:text-2xl transition-colors duration-300 ${styles.fontDisplay} group-hover:text-[#C9A96E]`}>
                        {video.title}
                      </h3>
                      <span className={`font-mono text-xs ${styles.textMuted} uppercase tracking-wider`}>
                        {video.duration}
                      </span>
                    </div>

                    {/* Vimeo Video Embed Container */}
                    <div className={`video-container relative aspect-video bg-[#111111] overflow-hidden ${styles.rounded} border ${isClean ? 'border-white/5' : 'border-black/5'} hover:border-[#C9A96E]/30 transition-all duration-300 shadow-xl`}>
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
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white/30 space-y-2 font-mono text-xs">
                          <p>VIMEO ID NOT CONFIGURED</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className={`text-center py-12 border border-dashed ${isClean ? 'border-white/10' : 'border-[#C9A96E]/20'} ${styles.rounded} p-6`}>
                  <p className={`italic text-base ${styles.textBodyMuted} ${styles.fontBody}`}>No delivery films loaded yet.</p>
                </div>
              )}
            </section>

            {/* SHARE SECTION */}
            <section className={`pt-8 border-t ${styles.border} space-y-6`}>
              <div className="text-center space-y-2">
                <h3 className={`text-xl ${isClean ? 'font-manrope font-bold text-white' : 'font-serif italic text-[#C9A96E]'}`}>
                  Share Your Story
                </h3>
                <p className={`text-xs ${styles.textBodyMuted} font-sans max-w-md mx-auto`}>
                  Share this secure personal workspace directly with family and friends, or publish it to your social feeds.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 transition-all shadow-sm active:scale-95 ${styles.shareBtn}`}
                  title="Share on Facebook"
                >
                  <Facebook size={16} />
                </a>

                {/* Twitter / X */}
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Watch our cinematic film delivered by Mavestone!`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 transition-all shadow-sm active:scale-95 ${styles.shareBtn}`}
                  title="Share on X (Twitter)"
                >
                  <Twitter size={16} />
                </a>

                {/* WhatsApp */}
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Watch our cinematic film delivered by Mavestone: ${shareUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 transition-all shadow-sm active:scale-95 ${styles.shareBtn}`}
                  title="Share on WhatsApp"
                >
                  <MessageCircle size={16} />
                </a>

                {/* Email */}
                <a
                  href={`mailto:?subject=${encodeURIComponent(`${portal.clientName} - ${portal.projectTitle}`)}&body=${encodeURIComponent(`Watch our cinematic film delivered by Mavestone: ${shareUrl}`)}`}
                  className={`p-3 transition-all shadow-sm active:scale-95 ${styles.shareBtn}`}
                  title="Share via Email"
                >
                  <Mail size={16} />
                </a>

                {/* Copy Link */}
                <button
                  onClick={handleCopyLink}
                  className={`flex items-center gap-2 px-4 py-2.5 transition-all shadow-sm text-xs font-mono active:scale-95 ${styles.shareBtn}`}
                  title="Copy Link to Clipboard"
                >
                  {copied ? (
                    <>
                      <Check size={14} className="text-green-600 animate-scale-in" />
                      <span className="text-green-600 font-medium">Link Copied</span>
                    </>
                  ) : (
                    <>
                      <LinkIcon size={14} />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </section>

            {/* DOWNLOAD SECTION */}
            {portal.downloadLink && portal.downloadLink.trim() !== '' && (
              <section className="pt-8 sm:pt-12">
                <div className={`border p-8 sm:p-10 text-center space-y-6 relative overflow-hidden shadow-sm ${styles.cardBg} ${styles.rounded}`}>
                  {!isClean && <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A96E]/50 to-transparent"></div>}
                  <div className="max-w-md mx-auto space-y-3">
                    <h3 className={`text-2xl ${styles.fontDisplay} ${isClean ? 'text-white' : 'text-[#C9A96E]'}`}>
                      Master Deliverables
                    </h3>
                    <p className={`text-sm font-sans ${styles.textBodyMuted} leading-relaxed`}>
                      Access high-bitrate ProRes masters and distribution formats. Your source media will remain hosted and accessible at this secure archive.
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <a
                      href={portal.downloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center gap-3 font-sans text-xs uppercase tracking-[0.2em] font-medium py-4 px-8 transition-all duration-300 shadow-md hover:shadow-lg ${styles.downloadBtn}`}
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
          <footer className={`py-16 text-center text-[10px] uppercase tracking-[0.3em] ${isClean ? 'text-white/20' : 'text-[#1A1A1A]/30'} relative z-10`}>
            <span>© 2026 Mavestone · All Rights Reserved</span>
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

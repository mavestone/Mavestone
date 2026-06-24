import React, { useEffect, useState } from 'react';
import { useContent } from '../context/ContentContext';

const MediaRenderer = ({ src, alt, className, style }: { src?: string; alt?: string; className?: string; style?: React.CSSProperties }) => {
  if (!src) return <div style={{...style, background: '#111'}} className={className}>[ MEDIA ]</div>;
  
  const cleanUrl = src.split('?')[0].toLowerCase();
  const isVideo = cleanUrl.endsWith('.mp4') || cleanUrl.endsWith('.webm') || cleanUrl.endsWith('.ogg') || cleanUrl.endsWith('.mov') || src.includes('video');

  if (isVideo) {
    return <video src={src} autoPlay loop muted playsInline className={className} style={style} />;
  }
  return <img src={src} alt={alt || 'Media'} className={className} style={style} />;
};

export const Hiring: React.FC = () => {
  const { hiringData } = useContent();

  const [ticked, setTicked] = useState<boolean[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Hiring - Liam Cinema";
  }, []);

  useEffect(() => {
    if (hiringData && hiringData.roleRequirements) {
      setTicked(new Array(hiringData.roleRequirements.length).fill(false));
    }
  }, [hiringData]);

  // Handle intersection observer for reveals
  useEffect(() => {
    const reveal = (el: HTMLElement, delay = 0) => {
      const anim = el.getAttribute("data-anim");
      el.style.transitionDelay = delay + "ms";
      if (anim === "quote") {
        el.style.transition = "clip-path 1.05s cubic-bezier(.16,1,.3,1)";
        el.style.clipPath = "inset(0 0 0 0)";
        el.style.opacity = "1";
      } else {
        el.style.transition = "opacity .8s cubic-bezier(.16,1,.3,1), transform .8s cubic-bezier(.16,1,.3,1)";
        el.style.opacity = "1";
        el.style.transform = "none";
      }
    };
    const hide = (el: HTMLElement) => {
      if (el.getAttribute("data-anim") === "quote") {
        el.style.clipPath = "inset(0 100% 0 0)";
        el.style.opacity = "1";
      } else {
        el.style.opacity = "0";
        el.style.transform = "translateY(26px)";
      }
    };

    const sections = Array.from(document.querySelectorAll("[data-reveal]")) as HTMLElement[];
    sections.forEach(hide);

    if (!("IntersectionObserver" in window)) { 
        sections.forEach((s) => reveal(s)); 
        return; 
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          reveal(e.target as HTMLElement);
          e.target.querySelectorAll("[data-reveal-child]").forEach((k, i) => {
            const child = k as HTMLElement;
            child.style.opacity = "0"; 
            child.style.transform = "translateY(18px)";
            requestAnimationFrame(() => reveal(child, 90 + i * 80));
          });
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -7% 0px" });
    
    sections.forEach((s) => io.observe(s));
    
    const timeoutId = setTimeout(() => sections.forEach((s) => {
      if (s.style.opacity === "0" || s.style.clipPath === "inset(0px 100% 0px 0px)" || s.style.clipPath === "inset(0 100% 0 0)") reveal(s);
    }), 2200);

    return () => {
        io.disconnect();
        clearTimeout(timeoutId);
    };
  }, [hiringData]);

  // Scopes canvas logic
  useEffect(() => {
    let scopeRaf: number;
    const canvases = Array.from(document.querySelectorAll("canvas[data-scope]")) as HTMLCanvasElement[];
    if (!canvases.length) return;
    const colors: Record<string, number[]> = { r: [229, 72, 77], g: [80, 200, 120], b: [95, 160, 208] };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const items = canvases.map((cv) => ({
      cv,
      ctx: cv.getContext("2d"),
      col: colors[cv.getAttribute("data-scope") || ''] || [233, 162, 59],
      seeds: Array.from({ length: 96 }, () => Math.random()),
      phase: Math.random() * 6.28
    }));
    let t = 0;
    const frame = () => {
      t += 0.016;
      for (const o of items) {
        const { cv, ctx, col, seeds, phase } = o;
        if (!ctx) continue;
        const cw = cv.clientWidth, chh = cv.clientHeight;
        if (!cw || !chh) continue;
        if (cv.width !== Math.round(cw * dpr)) { 
            cv.width = Math.round(cw * dpr); 
            cv.height = Math.round(chh * dpr); 
        }
        const W = cv.width, H = cv.height;
        ctx.clearRect(0, 0, W, H);
        ctx.strokeStyle = "rgba(236,231,221,0.05)";
        ctx.lineWidth = 1;
        for (const p of [0.25, 0.5, 0.75]) { 
            ctx.beginPath(); 
            ctx.moveTo(0, H * p); 
            ctx.lineTo(W, H * p); 
            ctx.stroke(); 
        }
        const N = 78, bw = W / N;
        for (let i = 0; i < N; i++) {
          const x = i * bw;
          const s = seeds[i % seeds.length];
          const env = Math.sin((i / (N - 1)) * Math.PI);
          const wob = Math.sin(t * 1.6 + i * 0.32 + phase) * 0.10 + Math.sin(t * 0.8 + s * 6.28) * 0.07;
          let v = env * 0.6 + 0.2 + wob + (s - 0.5) * 0.14;
          v = Math.max(0.04, Math.min(1, v));
          const y = H - v * H;
          const grd = ctx.createLinearGradient(0, y, 0, H);
          grd.addColorStop(0, "rgba(" + col[0] + "," + col[1] + "," + col[2] + ",0.9)");
          grd.addColorStop(1, "rgba(" + col[0] + "," + col[1] + "," + col[2] + ",0.04)");
          ctx.fillStyle = grd;
          ctx.fillRect(x, y, bw * 0.72, H - y);
        }
      }
      scopeRaf = requestAnimationFrame(frame);
    };
    frame();
    return () => {
        cancelAnimationFrame(scopeRaf);
    };
  }, [hiringData]);

  if (!hiringData) return null;

  const toggleReq = (index: number) => {
    const newTicked = [...ticked];
    newTicked[index] = !newTicked[index];
    setTicked(newTicked);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Archivo:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500&family=JetBrains+Mono:wght@400;500;700&display=swap');
        
        body { margin: 0; background: #0B0B0C; }
        img { display: block; }
        ::selection { background: #E9A23B; color: #0B0B0C; }
        @keyframes blink { 0%,55% { opacity:1 } 56%,100% { opacity:0.15 } }
        @keyframes grainShift { 0%{transform:translate(0,0)} 100%{transform:translate(-80px,-60px)} }
        
        .req-row:hover { background: rgba(233,162,59,0.05); padding-left: 18px !important; }
        .card-zoom:hover { transform: scale(1.045); z-index: 3; }
        .btn-primary:hover { filter: brightness(1.08); transform: translateY(-2px); }
        .btn-secondary:hover { border-color: #E9A23B !important; background: rgba(233,162,59,0.08) !important; }
      ` }} />

      <div style={{ position: 'relative', background: '#0B0B0C', color: '#ECE7DD', fontFamily: "'Archivo', sans-serif", WebkitFontSmoothing: 'antialiased', overflow: 'hidden' }}>

        {/* film grain */}
        <div style={{ position: 'fixed', inset: '-80px', zIndex: 9000, pointerEvents: 'none', opacity: 0.045, mixBlendMode: 'screen', backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"140\" height=\"140\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.85\" numOctaves=\"2\"/></filter><rect width=\"100%25\" height=\"100%25\" filter=\"url(%23n)\"/></svg>')", backgroundSize: '160px 160px', animation: 'grainShift 1.6s steps(3) infinite' }}></div>

        {/* ============ STATUS STRIP ============ */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', padding: '11px clamp(12px,4vw,64px)', borderBottom: '1px solid rgba(236,231,221,0.13)', fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(9px, 2.2vw, 11px)', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(236,231,221,0.6)' }}>
          <span className="truncate">Liam&nbsp;Cinema&nbsp;<span style={{ color: 'rgba(236,231,221,0.3)' }} className="hidden sm:inline">/&nbsp;Editorial&nbsp;Dept.</span></span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#E5484D', animation: 'blink 1.4s steps(1) infinite' }}></span>REC&nbsp;<span className="hidden xs:inline">01:06:47:26</span></span>
        </div>

        {/* ============ HERO ============ */}
        <section data-screen-label="Hero" style={{ position: 'relative', padding: 'clamp(34px,5vw,60px) clamp(20px,5vw,64px) 0' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

            {/* top letterbox label */}
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10.5px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(236,231,221,0.4)', marginBottom: 'clamp(24px,4vw,46px)' }}>Aspect 2.39:1 &nbsp;·&nbsp; 24 FPS &nbsp;·&nbsp; LOG-C &nbsp;·&nbsp; Take 01</div>

            <div style={{ display: 'grid', gap: 'clamp(28px,4vw,60px)', alignItems: 'center' }} className="grid-cols-1 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">

              {/* headline */}
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#E9A23B', marginBottom: '22px' }}>[ Position Open — Cinematic Editor ]</div>
                <h1 style={{ margin: 0, fontFamily: "'Anton', sans-serif", fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.005em' }} className="leading-[1.1] md:leading-[0.86]">
                  <span style={{ display: 'block', fontSize: 'clamp(24px,5vw,52px)', color: 'rgba(236,231,221,0.92)' }}>{hiringData.titleLine1 || "I'm hiring a"}</span>
                  <span style={{ display: 'block', fontSize: 'clamp(46px,12vw,148px)', color: '#E9A23B', margin: '0.02em 0' }} className="leading-[0.95] md:leading-[0.86]" dangerouslySetInnerHTML={{ __html: hiringData.titleLine2 || "Cinematic<br>Editor" }}></span>
                  <span style={{ display: 'block', fontSize: 'clamp(24px,5vw,52px)', color: 'rgba(236,231,221,0.92)' }}>{hiringData.titleLine3 || "to join the team."}</span>
                </h1>
              </div>

              {/* monitor */}
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'relative', background: '#000', border: '1px solid rgba(236,231,221,0.18)', padding: '8px' }}>
                  <div style={{ position: 'relative' }}>
                    <MediaRenderer src={hiringData.heroImage} alt="Hero" style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover', display: 'block' }} />
                    {/* monitor overlay HUD */}
                    <div style={{ position: 'absolute', top: '9px', left: '10px', display: 'flex', alignItems: 'center', gap: '7px', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.12em', color: 'rgba(236,231,221,0.85)', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}><span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#E5484D', animation: 'blink 1.4s steps(1) infinite' }}></span>REC</div>
                    <div style={{ position: 'absolute', bottom: '9px', right: '10px', fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.1em', color: 'rgba(236,231,221,0.85)', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>01:06:47:26</div>
                    {/* corner ticks */}
                    <div style={{ position: 'absolute', top: '6px', left: '6px', width: '14px', height: '14px', borderTop: '2px solid rgba(236,231,221,0.7)', borderLeft: '2px solid rgba(236,231,221,0.7)' }}></div>
                    <div style={{ position: 'absolute', top: '6px', right: '6px', width: '14px', height: '14px', borderTop: '2px solid rgba(236,231,221,0.7)', borderRight: '2px solid rgba(236,231,221,0.7)' }}></div>
                    <div style={{ position: 'absolute', bottom: '6px', left: '6px', width: '14px', height: '14px', borderBottom: '2px solid rgba(236,231,221,0.7)', borderLeft: '2px solid rgba(236,231,221,0.7)' }}></div>
                    <div style={{ position: 'absolute', bottom: '6px', right: '6px', width: '14px', height: '14px', borderBottom: '2px solid rgba(236,231,221,0.7)', borderRight: '2px solid rgba(236,231,221,0.7)' }}></div>
                  </div>
                </div>
                {/* live RGB waveform scopes */}
                <div style={{ marginTop: '8px', border: '1px solid rgba(236,231,221,0.14)', background: '#070708', padding: '8px 8px 9px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(236,231,221,0.45)', marginBottom: '7px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '7px' }}><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3DD68C', animation: 'blink 1.4s steps(1) infinite' }}></span>RGB Parade · Live</span>
                    <span>WFM</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px' }}>
                    <div style={{ position: 'relative' }}>
                      <canvas data-scope="r" style={{ width: '100%', height: '60px', display: 'block' }}></canvas>
                      <span style={{ position: 'absolute', top: '4px', left: '5px', fontFamily: "'JetBrains Mono', monospace", fontSize: '8.5px', letterSpacing: '0.1em', color: 'rgba(229,72,77,0.95)' }}>R</span>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <canvas data-scope="g" style={{ width: '100%', height: '60px', display: 'block' }}></canvas>
                      <span style={{ position: 'absolute', top: '4px', left: '5px', fontFamily: "'JetBrains Mono', monospace", fontSize: '8.5px', letterSpacing: '0.1em', color: 'rgba(80,200,120,0.95)' }}>G</span>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <canvas data-scope="b" style={{ width: '100%', height: '60px', display: 'block' }}></canvas>
                      <span style={{ position: 'absolute', top: '4px', left: '5px', fontFamily: "'JetBrains Mono', monospace", fontSize: '8.5px', letterSpacing: '0.1em', color: 'rgba(95,160,208,0.95)' }}>B</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* call sheet strip */}
            <div style={{ marginTop: 'clamp(34px,5vw,64px)', borderTop: '1px solid rgba(236,231,221,0.13)', borderBottom: '1px solid rgba(236,231,221,0.13)', display: 'grid' }} className="grid-cols-2 md:grid-cols-4 [&>div]:border-white/10 [&>div:nth-child(1)]:border-r [&>div:nth-child(1)]:border-b md:[&>div:nth-child(1)]:border-b-0 [&>div:nth-child(2)]:border-b md:[&>div:nth-child(2)]:border-b-0 md:[&>div:nth-child(2)]:border-r [&>div:nth-child(3)]:border-r">
              <div style={{ padding: '16px clamp(8px,2vw,24px) 16px 0' }} className="min-w-0">
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(236,231,221,0.42)', marginBottom: '7px' }}>Role</div>
                <div style={{ fontSize: 'clamp(13px,1.3vw,17px)', fontWeight: 600, wordWrap: 'break-word' }}>Cinematic Editor</div>
              </div>
              <div style={{ padding: '16px clamp(8px,2vw,24px)' }} className="min-w-0">
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(236,231,221,0.42)', marginBottom: '7px' }}>Engagement</div>
                <div style={{ fontSize: 'clamp(13px,1.3vw,17px)', fontWeight: 600, wordWrap: 'break-word' }}>Monthly Retainer</div>
              </div>
              <div style={{ padding: '16px clamp(8px,2vw,24px)' }} className="min-w-0">
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(236,231,221,0.42)', marginBottom: '7px' }}>Output</div>
                <div style={{ fontSize: 'clamp(13px,1.3vw,17px)', fontWeight: 600, wordWrap: 'break-word' }}>Reels · Travel · Docs</div>
              </div>
              <div style={{ padding: '16px 0 16px clamp(8px,2vw,24px)' }} className="min-w-0">
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(236,231,221,0.42)', marginBottom: '7px' }}>Brand</div>
                <div style={{ fontSize: 'clamp(13px,1.3vw,17px)', fontWeight: 600, color: '#E9A23B', wordWrap: 'break-word' }}>@liamcinema</div>
              </div>
            </div>

          </div>
        </section>

        {/* ============ THE BRIEF ============ */}
        <section data-reveal data-screen-label="Brief" style={{ padding: 'clamp(64px,9vw,120px) clamp(20px,5vw,64px) 0' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gap: 'clamp(24px,4vw,56px)' }} className="grid-cols-1 md:grid-cols-[minmax(0,0.3fr)_minmax(0,0.7fr)]">
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(236,231,221,0.5)' }}>
              <div style={{ color: '#E9A23B' }}>Reel 01</div>
              <div style={{ marginTop: '6px' }}>The Brief</div>
              <div style={{ marginTop: '18px', color: 'rgba(236,231,221,0.32)' }}>00:00:14:08</div>
            </div>
            <div className="[&_a]:text-[#E9A23B] [&_a]:no-underline [&_a]:border-b [&_a]:border-[#E9A23B]/45">
              <div style={{ margin: '0 0 20px', fontSize: 'clamp(19px,2vw,26px)', lineHeight: 1.5, fontWeight: 500, color: 'rgba(236,231,221,0.92)' }} dangerouslySetInnerHTML={{ __html: hiringData.introParagraph1 || "I'm Liam — a filmmaker and founder. I'm looking for a monthly retainer editor to cut reels for my personal brand, <a href=\"#\" style=\"color:#E9A23B;text-decoration:none;border-bottom:1px solid rgba(233,162,59,0.45);\">@liamcinema</a>." }} />
              <div style={{ margin: 0, fontSize: 'clamp(15px,1.4vw,18px)', lineHeight: 1.7, color: 'rgba(236,231,221,0.6)', maxWidth: '60ch' }} dangerouslySetInnerHTML={{ __html: hiringData.introParagraph2 || "You'll be working with footage from professional cinema cameras — travel films, reels and documentary content. The cut matters more than the trend." }} />
            </div>
          </div>
        </section>

        {/* ============ PULL QUOTE ============ */}
        <section data-reveal data-anim="quote" data-screen-label="Quote" style={{ padding: 'clamp(40px,5vw,72px) clamp(20px,5vw,64px) 0' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', borderTop: '1px solid rgba(236,231,221,0.13)', paddingTop: 'clamp(32px,4vw,52px)' }}>
            <div style={{ display: 'flex', gap: 'clamp(16px,2vw,28px)', alignItems: 'flex-start' }}>
              <span style={{ fontFamily: "'Anton', sans-serif", fontSize: 'clamp(60px,8vw,120px)', lineHeight: 0.7, color: '#E9A23B' }}>“</span>
              <div style={{ margin: 0, fontFamily: "'Archivo', sans-serif", fontStyle: 'italic', fontWeight: 500, fontSize: 'clamp(24px,3.4vw,46px)', lineHeight: 1.18, letterSpacing: '-0.01em', color: '#ECE7DD' }} dangerouslySetInnerHTML={{ __html: hiringData.introParagraph3 || "If your edits feel like short films instead of <span style=\"color:rgba(236,231,221,0.45);\">'content'</span>, send your work." }} />
            </div>
          </div>
        </section>

        {/* ============ MUST BE ABLE TO ============ */}
        <section data-reveal data-screen-label="Requirements" style={{ padding: 'clamp(64px,9vw,120px) clamp(20px,5vw,64px) 0' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px', borderBottom: '1px solid rgba(236,231,221,0.13)', paddingBottom: '18px', marginBottom: '6px' }}>
              <h2 style={{ margin: 0, fontFamily: "'Anton', sans-serif", fontWeight: 400, textTransform: 'uppercase', fontSize: 'clamp(28px,4vw,56px)', letterSpacing: '0.01em', lineHeight: 0.9 }}>Must be able to</h2>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(236,231,221,0.42)', whiteSpace: 'nowrap', textAlign: 'right', lineHeight: 1.7 }}>Reel 02 — Spec Sheet<br/><span style={{ color: 'rgba(236,231,221,0.3)' }}>Tap a line to tick ✓</span></span>
            </div>

            <div>
              {hiringData.roleRequirements.map((req, i) => (
                <div key={i} data-reveal-child className="req-row grid grid-cols-[28px_minmax(0,1fr)_auto] md:grid-cols-[28px_50px_minmax(0,1fr)_auto]" onClick={() => toggleReq(i)} style={{ alignItems: 'center', gap: 'clamp(14px,2.2vw,34px)', padding: 'clamp(20px,2.4vw,30px) 8px', borderBottom: '1px solid rgba(236,231,221,0.1)', transition: 'background .25s, padding-left .25s', position: 'relative', cursor: 'pointer', userSelect: 'none' }}>
                  {ticked[i] ? (
                    <span style={{ width: '27px', height: '27px', background: '#E9A23B', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0B0B0C', fontSize: '16px', fontWeight: 700, lineHeight: 1 }}>✓</span>
                  ) : (
                    <span style={{ width: '27px', height: '27px', border: '1.5px solid rgba(236,231,221,0.28)', transition: 'border-color .2s' }}></span>
                  )}
                  <span className="hidden md:block" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 'clamp(13px,1.2vw,15px)', color: '#E9A23B', letterSpacing: '0.06em' }}>R0{i + 1}</span>
                  <span style={{ fontFamily: "'Anton', sans-serif", textTransform: 'uppercase', fontWeight: 400, fontSize: 'clamp(18px,2.4vw,34px)', lineHeight: 1.04, letterSpacing: '0.01em', color: '#ECE7DD' }}>{req}</span>
                  {ticked[i] ? (
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#E9A23B', border: '1px solid rgba(233,162,59,0.5)', padding: '5px 9px', whiteSpace: 'nowrap' }}>✓ Noted</span>
                  ) : (
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(236,231,221,0.4)', border: '1px solid rgba(236,231,221,0.18)', padding: '5px 9px', whiteSpace: 'nowrap' }}>Required</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ CONTACT SHEET ============ */}
        <section data-reveal data-screen-label="Work" style={{ padding: 'clamp(64px,9vw,120px) clamp(20px,5vw,64px) 0' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px', marginBottom: 'clamp(22px,3vw,34px)' }}>
              <h2 style={{ margin: 0, fontFamily: "'Anton', sans-serif", fontWeight: 400, textTransform: 'uppercase', fontSize: 'clamp(28px,4vw,56px)', letterSpacing: '0.01em', lineHeight: 0.9 }}>The kind of work<br/>we make</h2>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(236,231,221,0.42)', whiteSpace: 'nowrap' }}>Reel 03 — Contact Sheet</span>
            </div>

            {/* filmstrip */}
            <div style={{ background: '#0e0e10', border: '1px solid rgba(236,231,221,0.13)' }}>
              <div style={{ height: '16px', backgroundColor: '#050505', backgroundImage: 'radial-gradient(circle at center, #d8d3c6 36%, transparent 40%)', backgroundSize: '30px 16px' }}></div>
              <div style={{ gap: '5px', padding: '5px', background: '#050505' }} className="grid grid-cols-1 md:grid-cols-3">
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }} className="card-zoom">
                    <MediaRenderer src={hiringData.card1Media} alt="Travel" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }} className="card-zoom">
                    <MediaRenderer src={hiringData.card2Media} alt="Reels" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }} className="card-zoom">
                    <MediaRenderer src={hiringData.card3Media} alt="Doc" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              </div>
              <div style={{ height: '16px', backgroundColor: '#050505', backgroundImage: 'radial-gradient(circle at center, #d8d3c6 36%, transparent 40%)', backgroundSize: '30px 16px' }}></div>
            </div>

            {/* captions */}
            <div style={{ gap: '5px', marginTop: '18px' }} className="grid grid-cols-1 md:grid-cols-3">
              <div data-reveal-child>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(236,231,221,0.4)', marginBottom: '11px' }}>Frame 037 &nbsp;·&nbsp; 00:00:41:12</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#E9A23B', marginBottom: '8px' }}>Travel Films</div>
                <p className="hidden md:block" style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: 'rgba(236,231,221,0.62)' }}>Cinematic long-form docs. Slow burn. Emotional payoff.</p>
              </div>
              <div data-reveal-child>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(236,231,221,0.4)', marginBottom: '11px' }}>Frame 041 &nbsp;·&nbsp; 00:01:06:47</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#E5684A', marginBottom: '8px' }}>Reels</div>
                <p className="hidden md:block" style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: 'rgba(236,231,221,0.62)' }}>Punchy. Story-first. Never just a highlight reel.</p>
              </div>
              <div data-reveal-child>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(236,231,221,0.4)', marginBottom: '11px' }}>Frame 045 &nbsp;·&nbsp; 00:02:14:03</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '12px', letterSpacing: '0.16em', textTransform: 'uppercase', color: '#5FA0D0', marginBottom: '8px' }}>Documentary</div>
                <p className="hidden md:block" style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: 'rgba(236,231,221,0.62)' }}>Real people, real moments. No polish over truth.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ============ DIRECTOR'S NOTE ============ */}
        <section data-reveal data-screen-label="Applicant" style={{ marginTop: 'clamp(64px,9vw,120px)', background: '#EAE4D8', color: '#16140F', padding: 'clamp(56px,8vw,104px) clamp(20px,5vw,64px)' }}>
          <div style={{ maxWidth: '980px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(22,20,15,0.55)', marginBottom: 'clamp(26px,3vw,40px)' }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#16140F' }}></span>
              Director's Note — What makes a great applicant
            </div>
            <div style={{ margin: 0, fontFamily: "'Archivo', sans-serif", fontWeight: 500, fontSize: 'clamp(22px,3vw,40px)', lineHeight: 1.32, letterSpacing: '-0.015em' }} dangerouslySetInnerHTML={{ __html: hiringData.applicantParagraph || "I care more about <em style=\"font-style:italic;\">attitude</em> than a perfect showreel. Technical skill develops; <span style=\"color:#B9762A;\">taste is harder to find.</span> I'm looking for someone who watches a cut back and genuinely can't send it out knowing something's off — not because it's their job, but because they care. If that's how you work, we'll get along fine." }} className="[&_em]:font-style-italic [&_p]:m-0" />
            <div style={{ marginTop: 'clamp(30px,4vw,48px)', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '1px', background: '#16140F' }}></div>
              <span style={{ fontFamily: "'Archivo', sans-serif", fontStyle: 'italic', fontSize: 'clamp(18px,2vw,24px)', fontWeight: 600 }}>Liam</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(22,20,15,0.5)' }}>Founder · Liam Cinema</span>
            </div>
          </div>
        </section>

        {/* ============ THE PROCESS ============ */}
        <section data-reveal data-screen-label="Process" style={{ padding: 'clamp(64px,9vw,120px) clamp(20px,5vw,64px) 0' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '16px', marginBottom: 'clamp(40px,5vw,64px)' }}>
              <h2 style={{ margin: 0, fontFamily: "'Anton', sans-serif", fontWeight: 400, textTransform: 'uppercase', fontSize: 'clamp(28px,4vw,56px)', letterSpacing: '0.01em', lineHeight: 0.9 }}>The process</h2>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(236,231,221,0.42)', whiteSpace: 'nowrap' }}>Reel 04 — Timeline</span>
            </div>

            {/* track with markers */}
            <div style={{ position: 'relative', alignItems: 'center', height: '34px', marginBottom: '26px' }} className={`hidden md:grid ${{ 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4', 5: 'md:grid-cols-5', 6: 'md:grid-cols-6' }[Math.max(1, Math.min(6, hiringData.processSteps.filter(s => s.trim().length > 0).length))] || 'md:grid-cols-3'} before:content-[''] before:absolute before:left-0 before:right-0 before:top-1/2 before:h-[2px] before:bg-white/10`}>
              {hiringData.processSteps.filter(s => s.trim().length > 0).map((_, i) => (
                  <div key={i} style={{ justifySelf: 'center', position: 'relative', zIndex: 2 }}><div style={{ width: '16px', height: '16px', background: i === 0 ? '#E9A23B' : i === 1 ? 'rgba(233,162,59,0.55)' : '#0B0B0C', border: i >= 2 ? '2px solid #E9A23B' : 'none', transform: 'rotate(45deg)' }}></div></div>
              ))}
            </div>

            {/* step content */}
            <div style={{ gap: 'clamp(20px,3vw,48px)' }} className={`grid grid-cols-1 ${{ 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4', 5: 'md:grid-cols-5', 6: 'md:grid-cols-6' }[Math.max(1, Math.min(6, hiringData.processSteps.filter(s => s.trim().length > 0).length))] || 'md:grid-cols-3'}`}>
              {hiringData.processSteps.filter(s => s.trim().length > 0).map((step, i) => (
                  <div key={i} data-reveal-child>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.16em', color: 'rgba(236,231,221,0.45)', marginBottom: '10px' }}>
                        {i === 0 ? "00:00:00 — IN" : i === 1 ? "00:01:30 — EDIT" : `00:0${Math.min(i + 1, 9)}:00 — OUT`}
                    </div>
                    <h3 style={{ margin: '0 0 12px', fontFamily: "'Anton', sans-serif", fontWeight: 400, textTransform: 'uppercase', fontSize: 'clamp(22px,2.4vw,32px)', color: i === 0 ? '#E9A23B' : i === 1 ? 'rgba(233,162,59,0.7)' : 'rgba(233,162,59,0.5)' }}>
                        {i === 0 ? "Pull footage" : i === 1 ? "Make the cut" : i === 2 ? "Submit" : i === 3 ? "Review" : i === 4 ? "Payment" : `Step ${i + 1}`}
                    </h3>
                    <p style={{ margin: 0, fontSize: '15px', lineHeight: 1.65, color: 'rgba(236,231,221,0.62)' }}>{step}</p>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ CTA ============ */}
        <section data-reveal data-screen-label="CTA" style={{ padding: 'clamp(80px,11vw,160px) clamp(20px,5vw,64px) clamp(40px,5vw,64px)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(236,231,221,0.42)', marginBottom: '18px' }}>End Of Reel — Your Move</div>
            <h2 style={{ margin: 0, fontFamily: "'Anton', sans-serif", fontWeight: 400, textTransform: 'uppercase', fontSize: 'clamp(64px,13vw,200px)', lineHeight: 0.82, letterSpacing: '0.01em' }}>Ready<br/><span style={{ color: '#E9A23B' }}>to cut?</span></h2>
            <p style={{ margin: '26px 0 40px', fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', letterSpacing: '0.05em', color: 'rgba(236,231,221,0.45)' }}>No rush. Take your time, show your skills.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <a href={hiringData.cta1URL || "https://drive.google.com/drive/folders/14TULwn541F9Jh1nV42A0fPf93Qi7Di1R?usp=drive_link"} target="_blank" rel="noreferrer" className="btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '11px', background: hiringData.cta1Color || '#E9A23B', color: '#0B0B0C', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '18px 34px', textDecoration: 'none', transition: 'filter .25s, transform .25s' }}>
                <span style={{ fontSize: '11px' }}>▶</span> {hiringData.cta1Label || "Download footage"}
              </a>
              <a href={hiringData.cta2URL || "#"} onClick={(e) => {
                  if (!hiringData.cta2URL) {
                      e.preventDefault();
                      alert("Upload form configuration required. Please link a Google Form or upload link.");
                  }
              }} target="_blank" rel="noreferrer" className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '11px', background: 'transparent', border: '1px solid rgba(236,231,221,0.28)', color: '#ECE7DD', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.12em', padding: '18px 34px', textDecoration: 'none', transition: 'border-color .25s, background .25s' }}>
                {hiringData.cta2Label || "Submit your cut"}
              </a>
            </div>
          </div>
        </section>

        {/* footer status */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '14px clamp(20px,5vw,64px)', borderTop: '1px solid rgba(236,231,221,0.13)', fontFamily: "'JetBrains Mono', monospace", fontSize: '10.5px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(236,231,221,0.38)' }}>
          <span>© Liam Cinema</span>
          <span>TC 01:06:47:26 / 24FPS</span>
          <span>EOF</span>
        </div>

      </div>
    </>
  );
};

export default Hiring;

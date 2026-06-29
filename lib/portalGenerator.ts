import { ClientPortal } from '../types';

/**
 * Generates a fully self-contained, premium single-file HTML delivery portal
 * with inline CSS, JS, Tailwind CDN, and Google Fonts.
 */
export function generatePortalHtml(project: ClientPortal): string {
  const jsonConfig = JSON.stringify(project, null, 2);
  const isClean = project.stylingType === 'clean';
  const isDark = project.themeMode === 'dark' || (project.themeMode !== 'light' && isClean);

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
      ? 'p-3 bg-white/5 border border-white/10 text-white hover:border-[#C9A96E] hover:text-[#C9A96E] rounded-full'
      : 'p-3 bg-white border border-black/5 text-[#1A1A1A] hover:border-[#C9A96E] hover:text-[#C9A96E] rounded-full',
    grainOpacity: isDark ? 'opacity-[0.025]' : 'opacity-[0.045]',
    grainBlend: isDark ? 'mix-blend-screen' : 'mix-blend-multiply',
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.projectTitle} — ${project.clientName} | Mavestone</title>
  
  <!-- OpenGraph Metadata for Facebook and Social Sharing -->
  <meta property="og:title" content="${project.videos && project.videos.length > 0 ? project.videos[0].title : project.projectTitle} — Delivered by Mavestone">
  <meta property="og:description" content="${project.message ? project.message.replace(/"/g, '&quot;') : `Secure client delivery portal for ${project.clientName}.`}">
  <meta property="og:image" content="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&h=630&q=80">
  <meta property="og:type" content="video.other">
  <meta name="twitter:card" content="summary_large_image">
  
  <!-- Google Fonts: Cormorant Garamond, DM Sans, and Manrope -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            serif: ['"Cormorant Garamond"', 'serif'],
            sans: ['"DM Sans"', 'sans-serif'],
            manrope: ['"Manrope"', 'sans-serif'],
          }
        }
      }
    }
  </script>

  <style>
    /* Premium grain overlay */
    .grain {
      position: fixed;
      inset: -80px;
      z-index: 9999;
      pointer-events: none;
      background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
      background-size: 160px 160px;
      animation: grainShift 1.6s steps(3) infinite;
    }
    
    @keyframes grainShift {
      0%, 100% { transform: translate(0, 0); }
      10% { transform: translate(-1%, -2%); }
      30% { transform: translate(-2%, 1%); }
      50% { transform: translate(2%, 3%); }
      70% { transform: translate(1%, -3%); }
      90% { transform: translate(-2%, 2%); }
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20%, 60% { transform: translateX(-6px); }
      40%, 80% { transform: translateX(6px); }
    }

    .animate-shake {
      animation: shake 0.4s ease-in-out;
    }
  </style>
</head>
<body class="${styles.bg} ${styles.text} min-h-screen relative overflow-x-hidden selection:bg-[#C9A96E]/20 selection:text-black font-sans">

  <!-- Grain Overlay -->
  <div class="grain ${styles.grainOpacity} ${styles.grainBlend}"></div>

  <!-- PASSCODE GATE (Lock Screen) -->
  <div id="passcode-gate" class="fixed inset-0 ${styles.bg} flex items-center justify-center p-6 z-50 transition-all duration-700">
    <div class="max-w-sm w-full space-y-10 text-center">
      <!-- Logo Wordmark -->
      <div class="space-y-1">
        <h2 class="text-[34px] font-bold tracking-tighter ${styles.logoText} font-manrope leading-tight">
          Mavestone<span class="text-[#C9A96E]">.</span>
        </h2>
        <p class="text-[10px] uppercase tracking-[0.25em] ${styles.textMuted} font-sans font-medium">
          Private Delivery Portal
        </p>
      </div>

      <!-- Passcode Form -->
      <form id="passcode-form" onsubmit="submitPasscode(event)" class="space-y-6">
        <div class="space-y-2 text-center">
          <p class="text-xs uppercase tracking-[0.2em] ${styles.textMuted} font-mono">Private Access Only</p>
          <p class="text-sm ${isClean ? 'font-sans' : 'italic font-serif'} ${isDark ? 'text-white/70' : 'text-[#1A1A1A]/70'}">Delivery portal for ${project.clientName}</p>
        </div>

        <div id="input-wrapper" class="relative">
          <input
            id="password-input"
            type="password"
            placeholder="Enter Passcode"
            class="w-full py-3.5 px-5 text-center text-sm focus:outline-none transition-all ${styles.input}"
            required
            autoFocus
          >
        </div>

        <p id="error-message" class="text-xs text-red-500/80 tracking-widest uppercase font-mono hidden">
          Incorrect passcode
        </p>

        <button
          type="submit"
          class="w-full group font-sans text-xs uppercase tracking-[0.2em] py-3.5 px-8 transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98] shadow-sm hover:shadow-md ${styles.button}"
        >
          <span>Access Workspace</span>
          <svg class="w-3.5 h-3.5 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </button>
      </form>
    </div>
  </div>

  <!-- PORTAL CONTENT -->
  <div id="portal-content" class="opacity-0 translate-y-4 transition-all duration-1000 ease-out">
    
    <!-- HEADER -->
    <header class="max-w-7xl mx-auto px-6 sm:px-12 py-8 flex items-center justify-between border-b ${styles.border} relative z-10">
      <div class="flex items-center gap-2.5">
        <svg class="w-3.5 h-3.5 text-[#C9A96E]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"></path>
        </svg>
        <div class="flex flex-col">
          <span class="text-[10px] font-bold uppercase tracking-[0.25em] ${isDark ? 'text-white/80' : 'text-[#1A1A1A]/80'} font-sans">
            Client Workspace
          </span>
          <span class="text-[8px] uppercase tracking-[0.2em] ${styles.textMuted} font-mono mt-0.5">
            Secure Delivery Portal
          </span>
        </div>
      </div>
      
      <a href="/" class="text-xl font-bold tracking-tighter ${styles.logoText} cursor-pointer hover:opacity-80 transition-opacity font-manrope select-none">
        Mavestone<span class="text-[#C9A96E]">.</span>
      </a>
    </header>

    <main class="max-w-4xl mx-auto px-6 sm:px-12 py-16 sm:py-24 relative z-10 space-y-16 sm:space-y-24">
      
      <!-- HERO SECTION -->
      <section class="space-y-6">
        <div class="flex items-center justify-end gap-4 text-xs font-mono uppercase tracking-[0.15em] ${styles.textMuted}">
          <span>${project.deliveryDate}</span>
        </div>
        
        <div class="space-y-2">
          <h1 class="text-4xl sm:text-6xl ${styles.fontDisplay} tracking-tight leading-tight">
            ${project.projectTitle}
          </h1>
          <div class="h-[1px] w-full bg-gradient-to-r from-[#C9A96E] via-[#C9A96E]/20 to-transparent"></div>
        </div>

        ${project.message ? `
        <div class="pt-4 max-w-xl">
          <p class="text-lg sm:text-xl ${isClean ? styles.textMainMuted + ' font-light font-sans' : 'font-serif italic text-[#1A1A1A]/80 font-light'} leading-relaxed">
            "${project.message}"
          </p>
        </div>` : ''}
      </section>

      <!-- VIDEOS SECTION -->
      <section class="space-y-16">
        ${project.videos && project.videos.length > 0 ? project.videos.map((video) => `
        <div class="space-y-4 group">
          <!-- Video Header info -->
          <div class="flex items-baseline justify-between border-b ${styles.borderLight} pb-3">
            <h3 class="text-xl sm:text-2xl transition-colors duration-300 ${styles.fontDisplay} group-hover:text-[#C9A96E]">
              ${video.title}
            </h3>
            <span class="font-mono text-xs ${styles.textMuted} uppercase tracking-wider">
              ${video.duration}
            </span>
          </div>

          <!-- Vimeo Video Embed Container -->
          <div class="relative aspect-video bg-[#111111] overflow-hidden ${styles.rounded} border ${isDark ? 'border-white/5' : 'border-black/5'} hover:border-[#C9A96E]/30 transition-all duration-300 shadow-xl">
            ${video.vimeoId ? `
            <iframe
              src="https://player.vimeo.com/video/${video.vimeoId}?color=C9A96E&title=0&byline=0&portrait=0&badge=0"
              class="absolute inset-0 w-full h-full"
              frameborder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen
              title="${video.title}"
            ></iframe>` : `
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-white/30 space-y-2 font-mono text-xs">
              <p>VIMEO ID NOT CONFIGURED</p>
            </div>`}
          </div>
        </div>`).join('\n') : `
        <div class="text-center py-12 border border-dashed ${isDark ? 'border-white/10' : 'border-[#C9A96E]/20'} ${styles.rounded} p-6">
          <p class="italic text-base ${styles.textBodyMuted} ${styles.fontBody}">No delivery films loaded yet.</p>
        </div>`}
      </section>

      <!-- SHARE SECTION -->
      <section class="pt-8 border-t ${styles.border} space-y-6">
        <div class="text-center space-y-2">
          <h3 class="text-xl ${isClean ? 'font-manrope font-bold' : 'font-serif italic'} ${isDark ? 'text-white' : 'text-[#C9A96E]'}">
            Share Your Story
          </h3>
          <p class="text-xs ${styles.textBodyMuted} font-sans max-w-md mx-auto">
            Share this secure personal workspace directly with family and friends, or publish it to your social feeds.
          </p>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <!-- Facebook -->
          <button
            onclick="shareFacebook()"
            class="${styles.shareBtn} transition-all shadow-sm active:scale-95"
            title="Share on Facebook"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9 8H7v3h2v9h4v-9h3.615L17 8h-3V6.157C13 5.37 13.5 5 14.285 5H17V2h-3c-3.3 0-5 1.557-5 4.5V8z"/></svg>
          </button>

          <!-- Twitter / X -->
          <button
            onclick="shareX()"
            class="${styles.shareBtn} transition-all shadow-sm active:scale-95"
            title="Share on X (Twitter)"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </button>

          <!-- WhatsApp -->
          <button
            onclick="shareWhatsApp()"
            class="${styles.shareBtn} transition-all shadow-sm active:scale-95"
            title="Share on WhatsApp"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12.004 2C6.48 2 2 6.48 2 12.004c0 1.764.462 3.483 1.34 5.008L2 22l5.122-1.34c1.472.802 3.12 1.228 4.882 1.228 5.524 0 10.004-4.48 10.004-10.004C22.008 6.48 17.528 2 12.004 2zm5.72 13.985c-.235.66-1.356 1.282-1.854 1.343-.473.056-.938.03-2.923-.746-2.54-1.026-4.17-3.626-4.298-3.797-.124-.17-.992-1.32-.992-2.52s.624-1.79.847-2.036c.224-.246.488-.308.65-.308.163 0 .326.002.468.008.148.006.347-.056.544.421.2.488.683 1.662.742 1.782.06.12.098.26.018.421-.08.16-.12.26-.24.4-.12.14-.253.313-.36.42-.12.12-.246.252-.105.493.14.24.623 1.022 1.336 1.657.918.816 1.69 1.07 1.934 1.19.244.12.388.1.53-.06.14-.16.613-.715.776-.96.16-.244.32-.2.54-.12s1.402.66 1.643.78c.24.12.4.18.46.28.06.1.06.58-.175 1.24z"/></svg>
          </button>

          <!-- Email -->
          <button
            onclick="shareEmail()"
            class="${styles.shareBtn} transition-all shadow-sm active:scale-95"
            title="Share via Email"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"></path></svg>
          </button>

          <!-- Copy Link -->
          <button
            onclick="copyLinkToClipboard()"
            id="copy-btn"
            class="flex items-center gap-2 px-4 py-2.5 transition-all shadow-sm text-xs font-mono active:scale-95 ${isDark ? 'bg-white/5 border border-white/10 text-white hover:border-[#C9A96E] hover:text-[#C9A96E] rounded-full' : 'bg-white border border-black/5 text-[#1A1A1A] hover:border-[#C9A96E] hover:text-[#C9A96E] rounded-full'}"
            title="Copy Link to Clipboard"
          >
            <svg id="copy-icon" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"></path></svg>
            <span id="copy-text">Copy Link</span>
          </button>
        </div>
      </section>

      <!-- DOWNLOAD SECTION -->
      ${project.downloadLink && project.downloadLink.trim() !== '' ? `
      <section class="pt-8 sm:pt-12">
        <div class="border p-8 sm:p-10 text-center space-y-6 relative overflow-hidden shadow-sm ${styles.cardBg} ${styles.rounded}">
          ${!isDark ? `<div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A96E]/50 to-transparent"></div>` : ''}
          <div class="max-w-md mx-auto space-y-3">
            <h3 class="text-2xl ${styles.fontDisplay} ${isClean ? 'text-white' : 'text-[#C9A96E]'}">
              Master Deliverables
            </h3>
            <p class="text-sm font-sans ${styles.textBodyMuted} leading-relaxed">
              Access high-bitrate ProRes masters and distribution formats. Your source media will remain hosted and accessible at this secure archive.
            </p>
          </div>
          
          <div class="pt-2">
            <a
              href="${project.downloadLink}"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-3 font-sans text-xs uppercase tracking-[0.2em] font-medium py-4 px-8 transition-all duration-300 shadow-md hover:shadow-lg ${styles.downloadBtn}"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              <span>Download Archive</span>
            </a>
          </div>
        </div>
      </section>` : ''}

    </main>

    <!-- PORTAL FOOTER -->
    <footer class="py-16 text-center text-[10px] uppercase tracking-[0.3em] ${isDark ? 'text-white/20' : 'text-[#1A1A1A]/30'} relative z-10">
      <span>© 2026 Mavestone · All Rights Reserved</span>
    </footer>
  </div>

  <script>
    // Config Object from creator
    const PROJECT = ${jsonConfig};

    // Check passcode requirements on load
    window.addEventListener('DOMContentLoaded', () => {
      const passcode = PROJECT.passcode;
      const isUnlocked = sessionStorage.getItem('portal_unlocked_' + PROJECT.id) === 'true';

      if (!passcode || passcode.trim() === '' || isUnlocked) {
        document.getElementById('passcode-gate').style.display = 'none';
        revealContent();
      }
    });

    function submitPasscode(e) {
      e.preventDefault();
      const input = document.getElementById('password-input');
      const value = input.value;
      const gate = document.getElementById('passcode-gate');
      const err = document.getElementById('error-message');
      const wrapper = document.getElementById('input-wrapper');

      if (value === PROJECT.passcode) {
        err.classList.add('hidden');
        sessionStorage.setItem('portal_unlocked_' + PROJECT.id, 'true');
        
        // Premium fade-out effect
        gate.classList.add('opacity-0');
        setTimeout(() => {
          gate.style.display = 'none';
          revealContent();
        }, 700);
      } else {
        err.classList.remove('hidden');
        wrapper.classList.add('animate-shake');
        input.value = '';
        setTimeout(() => {
          wrapper.classList.remove('animate-shake');
        }, 500);
      }
    }

    function revealContent() {
      const content = document.getElementById('portal-content');
      content.classList.remove('opacity-0', 'translate-y-4');
      content.classList.add('opacity-100', 'translate-y-0');
    }

    // Social Sharing JS
    function shareFacebook() {
      window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href), '_blank');
    }

    function shareX() {
      window.open('https://twitter.com/intent/tweet?url=' + encodeURIComponent(window.location.href) + '&text=' + encodeURIComponent('Watch our cinematic film delivered by Mavestone!'), '_blank');
    }

    function shareWhatsApp() {
      window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent('Watch our cinematic film delivered by Mavestone: ' + window.location.href), '_blank');
    }

    function shareEmail() {
      const subject = encodeURIComponent(PROJECT.clientName + ' - ' + PROJECT.projectTitle);
      const body = encodeURIComponent('Watch our cinematic film delivered by Mavestone: ' + window.location.href);
      window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
    }

    function copyLinkToClipboard() {
      navigator.clipboard.writeText(window.location.href).then(() => {
        const btn = document.getElementById('copy-btn');
        const text = document.getElementById('copy-text');
        const icon = document.getElementById('copy-icon');
        
        text.innerText = 'Link Copied';
        text.classList.add('text-green-600', 'font-medium');
        icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"></path>';
        icon.classList.add('text-green-600');
        
        setTimeout(() => {
          text.innerText = 'Copy Link';
          text.classList.remove('text-green-600', 'font-medium');
          icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"></path>';
          icon.classList.remove('text-green-600');
        }, 2000);
      });
    }
  </script>
</body>
</html>

<!--
================================================================================
HOW TO DEPLOY A NEW CLIENT PORTAL (Mavestone Guide)
================================================================================
1. Duplicate this file and rename it to match your client's slug (e.g. ${project.slug || 'slug'}.html).
2. Edit the PROJECT config object inside the script tag at the bottom of the file with your client's details.
3. Deploy the file to your web server, Netlify, Vercel, or static host.
4. For Netlify pretty URLs (so clients don't see the ".html" extension), add a "_redirects" file in your deployment:
   /${project.slug || 'slug'}  /${project.slug || 'slug'}.html  200
================================================================================
-->`;
}

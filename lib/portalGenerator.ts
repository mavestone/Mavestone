import { ClientPortal } from '../types';

/**
 * Generates a fully self-contained, premium single-file HTML delivery portal
 * with inline CSS, JS, Tailwind CDN, and Google Fonts.
 */
export function generatePortalHtml(project: ClientPortal): string {
  const jsonConfig = JSON.stringify(project, null, 2);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${project.projectTitle} — ${project.clientName} | Mavestone Media</title>
  
  <!-- Google Fonts: Cormorant Garamond & DM Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            serif: ['"Cormorant Garamond"', 'serif'],
            sans: ['"DM Sans"', 'sans-serif'],
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
      opacity: 0.035;
      mix-blend-mode: screen;
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

    /* Soft light glow for display titles */
    .text-glow {
      text-shadow: 0 0 30px rgba(255, 255, 255, 0.08);
    }
  </style>
</head>
<body class="bg-[#0A0A0A] text-[#F0EDE8] min-h-screen relative overflow-x-hidden selection:bg-[#C9A96E]/20 selection:text-white font-sans">

  <!-- Grain Overlay -->
  <div class="grain"></div>

  <!-- PASSCODE GATE (Lock Screen) -->
  <div id="passcode-gate" class="fixed inset-0 bg-[#0A0A0A] flex items-center justify-center p-6 z-50 transition-all duration-700">
    <div class="max-w-sm w-full space-y-10 text-center">
      <!-- Logo Wordmark -->
      <div class="space-y-1">
        <h2 class="text-[28px] sm:text-[34px] font-extralight tracking-[0.2em] uppercase font-serif text-[#F0EDE8] leading-tight">
          Mavestone
        </h2>
        <p class="text-[10px] uppercase tracking-[0.4em] text-[#C9A96E] font-sans font-light">
          Media
        </p>
      </div>

      <!-- Passcode Form -->
      <form id="passcode-form" onsubmit="submitPasscode(event)" class="space-y-6">
        <div class="space-y-2 text-center">
          <p class="text-xs uppercase tracking-[0.2em] text-[#F0EDE8]/40 font-mono">Private Access Only</p>
          <p class="text-sm italic font-serif text-[#F0EDE8]/70">Delivery portal for ${project.clientName}</p>
        </div>

        <div id="input-wrapper" class="relative">
          <input
            id="password-input"
            type="password"
            placeholder="Enter Passcode"
            class="w-full bg-[#111111]/80 border border-[#C9A96E]/20 hover:border-[#C9A96E]/40 focus:border-[#C9A96E] rounded-none py-3.5 px-5 text-center text-sm text-[#F0EDE8] placeholder-[#F0EDE8]/30 tracking-widest focus:outline-none transition-all font-mono"
            required
            autoFocus
          >
        </div>

        <p id="error-message" class="text-xs text-red-400/80 tracking-widest uppercase font-mono hidden">
          Incorrect passcode
        </p>

        <button
          type="submit"
          class="w-full group bg-transparent border border-[#C9A96E] text-[#C9A96E] hover:bg-[#C9A96E] hover:text-[#0A0A0A] font-sans text-xs uppercase tracking-[0.2em] py-3.5 px-8 transition-all duration-300 flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          <span>Access Workspace</span>
          <svg class="w-3.5 h-3.5 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
          </svg>
        </button>
      </form>
    </div>
  </div>

  <!-- PORTAL CONTENT -->
  <div id="portal-content" class="opacity-0 translate-y-4 transition-all duration-1000 ease-out">
    
    <!-- HEADER -->
    <header class="max-w-7xl mx-auto px-6 sm:px-12 py-8 flex items-center justify-between border-b border-[#F0EDE8]/10 relative z-10">
      <div class="flex flex-col">
        <span class="font-serif italic text-base sm:text-lg text-[#C9A96E] tracking-tight">
          Mavestone Media
        </span>
        <span class="text-[9px] uppercase tracking-[0.3em] text-[#F0EDE8]/30 font-sans mt-0.5">
          Client Workspace
        </span>
      </div>
      <div class="flex items-center gap-2 text-[#C9A96E]/60 text-[10px] uppercase tracking-widest font-mono">
        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
        </svg>
        <span>Secure Link</span>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-6 sm:px-12 py-16 sm:py-24 relative z-10 space-y-16 sm:space-y-24">
      
      <!-- HERO SECTION -->
      <section class="space-y-6">
        <div class="flex items-center justify-between gap-4 text-xs font-mono uppercase tracking-[0.15em] text-[#F0EDE8]/40">
          <span>Client: ${project.clientName}</span>
          <span>${project.deliveryDate}</span>
        </div>
        
        <div class="space-y-2">
          <h1 class="text-4xl sm:text-6xl font-light font-serif tracking-tight text-[#F0EDE8] leading-tight">
            ${project.projectTitle}
          </h1>
          <div class="h-[1px] w-full bg-gradient-to-r from-[#C9A96E] via-[#C9A96E]/20 to-transparent"></div>
        </div>

        ${project.message ? `
        <div class="pt-4 max-w-xl">
          <p class="font-serif italic text-lg sm:text-xl text-[#F0EDE8]/80 leading-relaxed font-light text-glow">
            "${project.message}"
          </p>
          <p class="font-serif italic text-sm text-[#C9A96E] mt-3">
            — Mavestone Media
          </p>
        </div>` : ''}
      </section>

      <!-- VIDEOS SECTION -->
      <section class="space-y-16">
        ${project.videos && project.videos.length > 0 ? project.videos.map((video) => `
        <div class="space-y-4 group">
          <!-- Video Header info -->
          <div class="flex items-baseline justify-between border-b border-[#F0EDE8]/5 pb-3">
            <h3 class="font-serif text-xl sm:text-2xl font-light text-[#F0EDE8] group-hover:text-[#C9A96E] transition-colors duration-300">
              ${video.title}
            </h3>
            <span class="font-mono text-xs text-[#F0EDE8]/40 uppercase tracking-wider">
              ${video.duration}
            </span>
          </div>

          <!-- Vimeo Video Embed Container -->
          <div class="relative aspect-video bg-[#111111] overflow-hidden border border-[#F0EDE8]/5 hover:border-[#C9A96E]/30 transition-all duration-300 shadow-2xl">
            ${video.vimeoId ? `
            <iframe
              src="https://player.vimeo.com/video/${video.vimeoId}?color=C9A96E&title=0&byline=0&portrait=0&badge=0"
              class="absolute inset-0 w-full h-full"
              frameborder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowfullscreen
              title="${video.title}"
            ></iframe>` : `
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center p-6 text-[#F0EDE8]/30 space-y-2 font-mono text-xs">
              <p>VIMEO ID NOT CONFIGURED</p>
            </div>`}
          </div>
        </div>`).join('\n') : `
        <div class="text-center py-12 border border-dashed border-[#C9A96E]/20 rounded p-6">
          <p class="font-serif italic text-base text-[#F0EDE8]/50">No delivery films loaded yet.</p>
        </div>`}
      </section>

      <!-- DOWNLOAD SECTION -->
      ${project.downloadLink && project.downloadLink.trim() !== '' ? `
      <section class="pt-8 sm:pt-12">
        <div class="border border-[#C9A96E]/30 bg-[#111111]/40 p-8 sm:p-10 text-center space-y-6 relative overflow-hidden">
          <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#C9A96E]/50 to-transparent"></div>
          <div class="max-w-md mx-auto space-y-3">
            <h3 class="font-serif text-2xl font-light text-[#C9A96E]">
              Master Deliverables
            </h3>
            <p class="text-sm font-sans text-[#F0EDE8]/60 leading-relaxed">
              Access high-bitrate ProRes masters and distribution formats. Your source media will remain hosted and accessible at this secure archive.
            </p>
          </div>
          
          <div class="pt-2">
            <a
              href="${project.downloadLink}"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-3 bg-[#C9A96E] text-[#0A0A0A] hover:bg-white hover:text-[#0A0A0A] font-sans text-xs uppercase tracking-[0.2em] font-medium py-4 px-8 transition-all duration-300 shadow-xl hover:shadow-[#C9A96E]/10"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
              <span>Download Archive</span>
            </a>
          </div>
        </div>
      </section>` : ''}

    </main>

    <!-- PORTAL FOOTER -->
    <footer class="py-16 text-center text-[10px] uppercase tracking-[0.3em] text-[#F0EDE8]/20 relative z-10">
      <span>© ${new Date().getFullYear()} Mavestone Media · All Rights Reserved</span>
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
  </script>
</body>
</html>

<!--
================================================================================
HOW TO DEPLOY A NEW CLIENT PORTAL (Mavestone Media Guide)
================================================================================
1. Duplicate this file and rename it to match your client's slug (e.g. ${project.slug || 'slug'}.html).
2. Edit the PROJECT config object inside the script tag at the bottom of the file with your client's details.
3. Deploy the file to your web server, Netlify, Vercel, or static host.
4. For Netlify pretty URLs (so clients don't see the ".html" extension), add a "_redirects" file in your deployment:
   /${project.slug || 'slug'}  /${project.slug || 'slug'}.html  200
================================================================================
-->`;
}

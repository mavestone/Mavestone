
import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkDevice = () => {
      const isLargeScreen = window.innerWidth >= 1024;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsDesktop(isLargeScreen && !isTouch);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useLayoutEffect(() => {
    if (!isDesktop) {
        document.body.style.height = '';
        return;
    }

    const content = contentRef.current;
    if (!content) return;

    // State
    let current = window.scrollY;
    let target = window.scrollY;
    let requestAnimationFrameId: number;
    
    // Config
    const ease = 0.08; 

    // Sync body height to content height to enable native scrollbar
    const resizeObserver = new ResizeObserver(() => {
       if (content) document.body.style.height = `${content.scrollHeight}px`;
    });
    resizeObserver.observe(content);
    
    // Initial height set
    document.body.style.height = `${content.scrollHeight}px`;

    const onScroll = () => {
      target = window.scrollY;
    };
    
    window.addEventListener('scroll', onScroll);

    const update = () => {
      // Linear interpolation
      const diff = target - current;
      const delta = diff * ease;

      if (Math.abs(diff) > 0.5) {
        current += delta;
        content.style.transform = `translate3d(0, -${current}px, 0)`;
        requestAnimationFrameId = requestAnimationFrame(update);
      } else {
        current = target;
        content.style.transform = `translate3d(0, -${target}px, 0)`;
        requestAnimationFrameId = requestAnimationFrame(update);
      }
    };
    
    update();

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(requestAnimationFrameId);
      resizeObserver.disconnect();
      document.body.style.height = '';
      if (content) content.style.transform = '';
    };
  }, [isDesktop, location.pathname]);

  if (!isDesktop) {
      return <>{children}</>;
  }

  return (
    <div 
        ref={contentRef}
        className="fixed top-0 left-0 w-full z-0"
        style={{ willChange: 'transform' }}
    >
      {children}
    </div>
  );
};

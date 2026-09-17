import { cn } from '../../lib/utils';
import React, { ComponentPropsWithoutRef } from 'react';

export interface MarqueeProps extends ComponentPropsWithoutRef<'div'> {
  /**
   * Optional, can be used to add more content to the marquee
   */
  children?: React.ReactNode;
  /**
   * Optional, can be used to add custom styles to the marquee
   */
  className?: string;
  /**
   * Optional, can be used to reverse the marquee direction
   */
  reverse?: boolean;
  /**
   * Optional, can be used to pause the marquee on hover
   */
  pauseOnHover?: boolean;
  /**
   * Optional, can be used to run the marquee vertically
   */
  vertical?: boolean;
  /**
   * Optional, can be used to repeat the children
   */
  repeat?: number;
  /**
   * Optional negative or positive animation delay so tracks start already pre-scrolled
   */
  animationDelay?: string;
  [key: string]: any;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 5,
  animationDelay,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        'group flex overflow-hidden [--duration:40s] [--gap:1.25rem] [gap:var(--gap)] select-none',
        vertical ? 'flex-col' : 'flex-row',
        className
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            style={animationDelay ? { animationDelay } : undefined}
            className={cn('flex shrink-0 [gap:var(--gap)] will-change-transform', {
              'flex-col': vertical,
              'flex-row': !vertical,
              'animate-marquee-vertical': vertical && !reverse,
              'animate-marquee-vertical-reverse': vertical && reverse,
              'animate-marquee': !vertical && !reverse,
              'animate-marquee-reverse': !vertical && reverse,
              'group-hover:[animation-play-state:paused]': pauseOnHover,
            })}
          >
            {children}
          </div>
        ))}
    </div>
  );
}

export default Marquee;

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxOptions {
  speed?: number;
  direction?: 'up' | 'down';
}

export const useParallax = (options: ParallaxOptions = {}) => {
  const { speed = 0.5, direction = 'up' } = options;
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Skip on mobile for performance
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const yPercent = direction === 'up' ? -100 * speed : 100 * speed;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        { yPercent: 0 },
        {
          yPercent,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    });

    return () => ctx.revert();
  }, [speed, direction]);

  return elementRef;
};

export default useParallax;

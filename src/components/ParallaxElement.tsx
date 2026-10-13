import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxElementProps {
  children: ReactNode;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  className?: string;
  scale?: boolean;
  opacity?: boolean;
}

const ParallaxElement = ({
  children,
  speed = 0.3,
  direction = 'up',
  className = '',
  scale = false,
  opacity = false,
}: ParallaxElementProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Skip heavy parallax on mobile for performance
    const isMobile = window.innerWidth < 768;
    const adjustedSpeed = isMobile ? speed * 0.3 : speed;

    const getTransform = () => {
      switch (direction) {
        case 'up':
          return { y: 100 * adjustedSpeed };
        case 'down':
          return { y: -100 * adjustedSpeed };
        case 'left':
          return { x: 100 * adjustedSpeed };
        case 'right':
          return { x: -100 * adjustedSpeed };
        default:
          return { y: 100 * adjustedSpeed };
      }
    };

    const getEndTransform = () => {
      switch (direction) {
        case 'up':
          return { y: -100 * adjustedSpeed };
        case 'down':
          return { y: 100 * adjustedSpeed };
        case 'left':
          return { x: -100 * adjustedSpeed };
        case 'right':
          return { x: 100 * adjustedSpeed };
        default:
          return { y: -100 * adjustedSpeed };
      }
    };

    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        {
          ...getTransform(),
          scale: scale ? 0.9 : 1,
          opacity: opacity ? 0.5 : 1,
        },
        {
          ...getEndTransform(),
          scale: 1,
          opacity: 1,
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
  }, [speed, direction, scale, opacity]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

export default ParallaxElement;

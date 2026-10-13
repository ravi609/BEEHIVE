import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParallaxElement from './ParallaxElement';

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    if (!headlineRef.current) return;

    const chars = headlineRef.current.querySelectorAll('.char');
    
    gsap.fromTo(chars, 
      { 
        opacity: 0, 
        y: 100,
        rotationX: -90,
      },
      { 
        opacity: 1, 
        y: 0,
        rotationX: 0,
        stagger: 0.03,
        duration: 1,
        ease: 'power4.out',
        delay: 0.8,
      }
    );

    // Parallax effect on hero section
    if (sectionRef.current) {
      const isMobile = window.innerWidth < 768;
      if (!isMobile) {
        gsap.to(sectionRef.current, {
          yPercent: 30,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }
  }, []);

  const splitText = (text: string) => {
    return text.split('').map((char, index) => (
      <span 
        key={index} 
        className="char inline-block"
        style={{ perspective: '1000px' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <section 
      id="section-01" 
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-16 overflow-hidden"
    >
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute inset-0 transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            className="w-full h-full object-cover"
          >
            <source src="https://player.vimeo.com/external/459863005.hd.mp4?s=c18bbc2fe0a0e7d13b2b7a21b76fbb8bd4a99a9d&profile_id=175" type="video/mp4" />
          </video>
        </div>
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/70 z-10" />
        {/* Animated gradient overlay */}
        <motion.div 
          className="absolute inset-0 z-10"
          animate={{
            background: [
              'radial-gradient(circle at 30% 30%, hsl(var(--neon-cyan) / 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 70% 70%, hsl(var(--neon-magenta) / 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 30% 30%, hsl(var(--neon-cyan) / 0.1) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="max-w-6xl mx-auto text-center relative z-20">
        {/* Subtitle with parallax */}
        <ParallaxElement speed={0.2} direction="down">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hud-element mb-4 sm:mb-6 md:mb-8 text-[10px] sm:text-xs"
          >
            We Create Digital Experiences
          </motion.p>
        </ParallaxElement>

        {/* Main Headline */}
        <h1 
          ref={headlineRef}
          className="text-display text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-foreground leading-[0.9] mb-6 sm:mb-8"
        >
          <div className="overflow-hidden">
            {splitText('DIGITAL')}
          </div>
          <div className="overflow-hidden text-gradient">
            {splitText('INNOVATION')}
          </div>
          <div className="overflow-hidden">
            {splitText('STUDIO')}
          </div>
        </h1>

        {/* CTA with parallax */}
        <ParallaxElement speed={0.15} direction="up">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.8 }}
            className="mt-8 sm:mt-12"
          >
            <a 
              href="#work"
              className="group inline-flex items-center gap-2 sm:gap-3 text-foreground hover:text-primary transition-colors duration-300"
            >
              <span className="uppercase tracking-[0.15em] sm:tracking-[0.2em] text-xs sm:text-sm font-medium">Explore Our Work</span>
              <span className="w-6 sm:w-8 h-px bg-current group-hover:w-10 sm:group-hover:w-12 transition-all duration-300" />
            </a>
          </motion.div>
        </ParallaxElement>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          className="absolute bottom-16 sm:bottom-24 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 sm:gap-3">
            <span className="hud-element text-[10px] sm:text-xs">Scroll</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-px h-6 sm:h-8 bg-gradient-to-b from-muted-foreground to-transparent"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

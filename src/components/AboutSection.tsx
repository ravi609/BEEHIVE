import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParallaxElement from './ParallaxElement';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: '50+', label: 'Projects Delivered' },
  { value: '15+', label: 'Years Experience' },
  { value: '40+', label: 'Team Members' },
  { value: '12', label: 'Industry Awards' },
];

const AboutSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const capabilitiesRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Heading reveal with clip-path
      if (headingRef.current) {
        gsap.fromTo(headingRef.current,
          { 
            clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)',
            opacity: 0 
          },
          {
            clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
            opacity: 1,
            duration: 1.2,
            ease: 'power4.inOut',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 80%',
              end: 'top 50%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Stats stagger animation
      if (statsRef.current) {
        const statItems = statsRef.current.querySelectorAll('.stat-item');
        gsap.fromTo(statItems,
          { y: 80, opacity: 0, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.15,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: statsRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Capabilities reveal
      if (capabilitiesRef.current) {
        const items = capabilitiesRef.current.querySelectorAll('.capability-item');
        gsap.fromTo(items,
          { x: -50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            stagger: 0.1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: capabilitiesRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="relative py-20 sm:py-32 md:py-48 px-4 sm:px-6 md:px-16"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-24">
          {/* Left Column */}
          <div>
            <ParallaxElement speed={0.15} direction="down">
              <div ref={headingRef}>
                <span className="hud-element mb-2 sm:mb-4 block text-[10px] sm:text-xs">About Us</span>
                <h2 className="text-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-6 sm:mb-8">
                  WE BUILD <br/>
                  <span className="text-gradient">DIGITAL</span> <br/>
                  EXPERIENCES
                </h2>
              </div>
            </ParallaxElement>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed"
            >
              We are a collective of designers, developers, and dreamers pushing 
              the boundaries of digital creativity. Our work spans immersive 
              experiences, interactive installations, and next-generation web platforms.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed mt-4 sm:mt-6"
            >
              Every project is an opportunity to create something extraordinary. 
              We blend art, technology, and storytelling to craft experiences 
              that resonate and inspire.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 sm:mt-10"
            >
              <a 
                href="#contact"
                className="group inline-flex items-center gap-2 sm:gap-3 text-foreground hover:text-primary transition-colors duration-300"
              >
                <span className="uppercase tracking-[0.15em] sm:tracking-[0.2em] text-xs sm:text-sm font-medium">Get In Touch</span>
                <span className="w-6 sm:w-8 h-px bg-current group-hover:w-10 sm:group-hover:w-12 transition-all duration-300" />
              </a>
            </motion.div>
          </div>

          {/* Right Column - Stats */}
          <ParallaxElement speed={0.2} direction="up">
            <div ref={statsRef} className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 content-start">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="stat-item relative p-4 sm:p-6 border border-border bg-card/50"
                >
                  <span className="text-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gradient">
                    {stat.value}
                  </span>
                  <span className="block mt-1 sm:mt-2 hud-element text-[10px] sm:text-xs">
                    {stat.label}
                  </span>
                  
                  {/* Corner accents */}
                  <span className="absolute top-0 left-0 w-2 sm:w-3 h-2 sm:h-3 border-t border-l border-primary" />
                  <span className="absolute bottom-0 right-0 w-2 sm:w-3 h-2 sm:h-3 border-b border-r border-primary" />
                </div>
              ))}
            </div>
          </ParallaxElement>
        </div>

        {/* Capabilities */}
        <div
          ref={capabilitiesRef}
          className="mt-16 sm:mt-24 md:mt-32 pt-10 sm:pt-16 border-t border-border"
        >
          <span className="hud-element mb-6 sm:mb-8 block text-[10px] sm:text-xs">What We Do</span>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {['Interactive Design', 'Web Development', '3D Experiences', 'Brand Strategy'].map((capability) => (
              <div key={capability} className="capability-item group">
                <span className="text-display text-base sm:text-lg md:text-xl text-foreground group-hover:text-primary transition-colors duration-300">
                  {capability}
                </span>
                <div className="mt-2 sm:mt-3 w-full h-px bg-border group-hover:bg-primary transition-colors duration-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

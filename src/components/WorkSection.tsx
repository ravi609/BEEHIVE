import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParallaxElement from './ParallaxElement';
import useSoundEffects from '@/hooks/useSoundEffects';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 'carrybee',
    title: 'CARRY BEE',
    category: 'On-Demand Delivery',
    year: '2026',
    color: 'from-neon-yellow/20',
  },
  {
    id: 'blacksquad',
    title: 'BLACKSQUAD',
    category: 'Gym Maintenance',
    year: '2026',
    color: 'from-neon-magenta/20',
  },
  {
    id: 'vertex',
    title: 'VERTEX',
    category: 'Product Launch',
    year: '2023',
    color: 'from-neon-yellow/20',
  },
  {
    id: 'pulse',
    title: 'PULSE',
    category: 'Digital Platform',
    year: '2023',
    color: 'from-neon-cyan/20',
  },
];

const WorkSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });
  const { playSound } = useSoundEffects();

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = sectionRef.current?.querySelectorAll('.project-item');
      
      cards?.forEach((card) => {
        gsap.fromTo(card, 
          { 
            opacity: 0, 
            y: 80,
            scale: 0.95,
            rotateX: 5,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top bottom-=50',
              end: 'top center',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      // Section header parallax
      const header = sectionRef.current?.querySelector('.section-header');
      if (header) {
        gsap.fromTo(header,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: header,
              start: 'top 85%',
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
      id="work" 
      ref={sectionRef}
      className="relative py-20 sm:py-32 md:py-48 px-4 sm:px-6 md:px-16"
    >
      {/* Section Header */}
      <ParallaxElement speed={0.1} direction="down" className="section-header max-w-7xl mx-auto mb-10 sm:mb-16 md:mb-24">
        <span className="hud-element mb-2 sm:mb-4 block text-[10px] sm:text-xs">Selected Projects</span>
        <h2 className="text-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-foreground">
          OUR <span className="text-gradient">WORK</span>
        </h2>
      </ParallaxElement>

      {/* Projects Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {projects.map((project, index) => (
            <Link
              key={project.id}
              to={`/project/${project.id}`}
              onClick={() => playSound('whoosh')}
              onMouseEnter={() => playSound('hover')}
            >
              <motion.div
                className="project-item project-card group relative aspect-[4/3] sm:aspect-[4/3] bg-card overflow-hidden cursor-pointer"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.5 }}
              >
                {/* Gradient Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${project.color} to-transparent opacity-30 group-hover:opacity-60 transition-opacity duration-500`} />
                
                {/* Grid Lines */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
                    {[...Array(16)].map((_, i) => (
                      <div key={i} className="border border-muted/30" />
                    ))}
                  </div>
                </div>

                {/* Project Info */}
                <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-between z-20">
                  <div className="flex justify-between items-start">
                    <span className="hud-element text-[10px] sm:text-xs">{project.category}</span>
                    <span className="hud-element text-[10px] sm:text-xs">{project.year}</span>
                  </div>
                  
                  <div>
                    <h3 className="text-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </h3>
                    
                    <motion.div
                      className="mt-3 sm:mt-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <span className="uppercase tracking-[0.1em] sm:tracking-[0.15em] text-[10px] sm:text-xs font-medium text-foreground">View Project</span>
                      <span className="w-3 sm:w-4 h-px bg-foreground group-hover:w-6 sm:group-hover:w-8 transition-all duration-300" />
                    </motion.div>
                  </div>
                </div>

                {/* Number */}
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-8 text-display text-5xl sm:text-6xl md:text-8xl text-foreground/5 group-hover:text-foreground/10 transition-colors duration-500">
                  0{index + 1}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      {/* View All Link */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="max-w-7xl mx-auto mt-8 sm:mt-12 md:mt-16 text-center"
      >
        <a 
          href="#"
          onMouseEnter={() => playSound('hover')}
          onClick={() => playSound('click')}
          className="group inline-flex items-center gap-2 sm:gap-3 text-foreground hover:text-primary transition-colors duration-300"
        >
          <span className="uppercase tracking-[0.15em] sm:tracking-[0.2em] text-xs sm:text-sm font-medium">View All Projects</span>
          <span className="w-6 sm:w-8 h-px bg-current group-hover:w-10 sm:group-hover:w-12 transition-all duration-300" />
        </a>
      </motion.div>
    </section>
  );
};

export default WorkSection;

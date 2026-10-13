import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useSoundEffects from '@/hooks/useSoundEffects';
import CustomCursor from '@/components/CustomCursor';
import ThemeToggle from '@/components/ThemeToggle';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: 'carrybee',
    title: 'CARRY BEE',
    category: 'On-Demand Delivery',
    year: '2026',
    color: 'from-neon-yellow/20',
    description: 'An on-demand delivery platform built for Kunnathur — bringing food, groceries, and medicines to a community no delivery app had reached before.',
    challenge: 'Kunnathur had no delivery service of any kind — not for food, not for groceries, not for medicine. Residents had to travel out of the area for essentials that people elsewhere could order in minutes, and local restaurants, shops, and pharmacies had no way to reach customers beyond who walked through their door.',
    solution: 'We built CarryBee from the ground up specifically for Kunnathur: a simple ordering website connecting local restaurants, grocery stores, and pharmacies to the community, backed by a dedicated rider network that carries orders straight to the doorstep — the first delivery platform the area has had.',
    results: [],
    technologies: ['React', 'Node.js', 'Google Maps API', 'Razorpay', 'Firebase', 'Real-Time Tracking'],
    images: [
      'https://images.unsplash.com/photo-1743631951441-305c2a6b0487?w=1200',
      'https://images.unsplash.com/photo-1752070182361-9fa562ed7f97?w=1200',
      'https://images.unsplash.com/photo-1595025959432-8447f5598ed9?w=1200',
      'https://images.unsplash.com/photo-1696861286643-341a8d7a79e9?w=1200',
    ],
  },
  {
    id: 'blacksquad',
    title: 'BLACKSQUAD',
    category: 'Gym Maintenance',
    year: '2026',
    color: 'from-neon-magenta/20',
    description: 'A next-generation membership platform for modern gyms, pairing every member with a personalized training and recovery journey while giving owners a real-time command center for their business.',
    challenge: 'Members had no structure between sessions — no reminders, no visibility into their own attendance or fees, nowhere to turn for recovery guidance. Owners were tracking who showed up, who\'d paid, and who\'d been given a plan across spreadsheets and memory, with no single source of truth for the gym floor.',
    solution: 'We built BlackSquad as one platform for both sides of the gym. Members get their attendance history, a personalized diet and workout plan, an AI recovery bot for guidance between sessions, and timely reminders — for their next visit and before their fee plan expires. Owners get a live dashboard of attendance, unpaid fees, and exactly which plan each member is on — one connected system in place of spreadsheets and memory.',
    results: [],
    technologies: [],
    images: [
      'https://images.unsplash.com/photo-1728486887318-398f1448f7ae?w=1200',
      'https://images.unsplash.com/photo-1561212942-0d77ee345b35?w=1200',
      'https://images.unsplash.com/photo-1758875570137-8691b7c55033?w=1200',
      'https://images.unsplash.com/photo-1543352632-5a4b24e4d2a6?w=1200',
    ],
  },
  {
    id: 'vertex',
    title: 'VERTEX',
    category: 'Product Launch',
    year: '2023',
    color: 'from-neon-yellow/20',
    description: 'A revolutionary product launch experience that combined AR technology with real-time customization.',
    challenge: 'Create an unforgettable product reveal that drives pre-orders while showcasing the product\'s innovative features.',
    solution: 'We built an AR-enabled configurator allowing users to visualize and customize products in their own space, integrated with a live launch event.',
    results: ['500K pre-orders', '10M live viewers', '85% conversion rate', 'Record launch day sales'],
    technologies: ['AR.js', '8th Wall', 'React Native', 'Three.js', 'Firebase'],
    images: [
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200',
      'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=1200',
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200',
    ],
  },
  {
    id: 'pulse',
    title: 'PULSE',
    category: 'Digital Platform',
    year: '2023',
    color: 'from-neon-cyan/20',
    description: 'A next-generation platform that transforms how teams collaborate on creative projects.',
    challenge: 'Design a platform that simplifies complex creative workflows while encouraging innovation and experimentation.',
    solution: 'We created an intuitive workspace with real-time collaboration, AI-assisted tools, and seamless integration with industry-standard software.',
    results: ['100K active users', '4.8/5 App Store rating', '$2M ARR in 6 months', '60% time savings'],
    technologies: ['React', 'TypeScript', 'WebRTC', 'AI/ML', 'GraphQL', 'Kubernetes'],
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200',
    ],
  },
];

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [currentImage, setCurrentImage] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const { playSound } = useSoundEffects();

  const project = projects.find((p) => p.id === id);
  const currentIndex = projects.findIndex((p) => p.id === id);
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null;
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null;

  useEffect(() => {
    setIsLoaded(true);
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (!contentRef.current || !isLoaded) return;

    const ctx = gsap.context(() => {
      // Animate content sections
      const sections = contentRef.current?.querySelectorAll('.animate-section');
      sections?.forEach((section, index) => {
        gsap.fromTo(
          section,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, contentRef);

    return () => ctx.revert();
  }, [isLoaded, id]);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-display text-4xl text-foreground mb-4">Project Not Found</h1>
          <Link to="/" className="text-primary hover:underline">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <CustomCursor />
      <ThemeToggle />

      <AnimatePresence mode="wait">
        <motion.div
          key={id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-background text-foreground"
        >
          {/* Back Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="fixed top-4 left-4 sm:top-6 sm:left-6 md:top-8 md:left-8 z-50"
          >
            <Link
              to="/"
              onClick={() => playSound('click')}
              onMouseEnter={() => playSound('hover')}
              className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="hud-element text-[10px] sm:text-xs">Back</span>
            </Link>
          </motion.div>

          {/* Hero Section */}
          <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-16 overflow-hidden">
            {/* Background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${project.color} to-transparent opacity-30`} />
            
            <div className="max-w-6xl mx-auto text-center relative z-10 pt-20">
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="hud-element mb-4 block text-[10px] sm:text-xs"
              >
                {project.category} — {project.year}
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-foreground mb-8"
              >
                {project.title}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto"
              >
                {project.description}
              </motion.p>

              {/* Scroll indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="w-px h-12 bg-gradient-to-b from-muted-foreground to-transparent"
                />
              </motion.div>
            </div>
          </section>

          {/* Content */}
          <div ref={contentRef} className="px-4 sm:px-6 md:px-16 pb-20 sm:pb-32">
            {/* Image Gallery */}
            <section className="animate-section max-w-7xl mx-auto mb-20 sm:mb-32">
              <div className="relative aspect-video overflow-hidden bg-card mb-4">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImage}
                    src={project.images[currentImage]}
                    alt={`${project.title} - Image ${currentImage + 1}`}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Image navigation */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {project.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentImage(index);
                        playSound('click');
                      }}
                      onMouseEnter={() => playSound('hover')}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImage
                          ? 'bg-primary w-8'
                          : 'bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Thumbnail strip */}
              <div className="grid grid-cols-4 gap-2 sm:gap-4">
                {project.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImage(index);
                      playSound('click');
                    }}
                    onMouseEnter={() => playSound('hover')}
                    className={`relative aspect-video overflow-hidden transition-all ${
                      index === currentImage
                        ? 'ring-2 ring-primary'
                        : 'opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </section>

            {/* Case Study Content */}
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24">
              {/* Challenge */}
              <section className="animate-section">
                <span className="hud-element mb-4 block text-[10px] sm:text-xs">The Challenge</span>
                <p className="text-foreground text-base sm:text-lg leading-relaxed">
                  {project.challenge}
                </p>
              </section>

              {/* Solution */}
              <section className="animate-section">
                <span className="hud-element mb-4 block text-[10px] sm:text-xs">Our Solution</span>
                <p className="text-foreground text-base sm:text-lg leading-relaxed">
                  {project.solution}
                </p>
              </section>
            </div>

            {/* Results */}
            {project.results.length > 0 && (
              <section className="animate-section max-w-5xl mx-auto mt-16 sm:mt-24">
                <span className="hud-element mb-8 block text-[10px] sm:text-xs">Results</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  {project.results.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 sm:p-6 border border-border bg-card/50 relative group"
                      onMouseEnter={() => playSound('hover')}
                    >
                      <span className="text-display text-lg sm:text-xl md:text-2xl text-gradient block">
                        {result}
                      </span>
                      <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                      <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Technologies */}
            {project.technologies.length > 0 && (
              <section className="animate-section max-w-5xl mx-auto mt-16 sm:mt-24">
                <span className="hud-element mb-8 block text-[10px] sm:text-xs">Technologies Used</span>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  {project.technologies.map((tech, index) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      onMouseEnter={() => playSound('hover')}
                      className="px-4 py-2 border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </section>
            )}

            {/* Project Navigation */}
            <section className="max-w-5xl mx-auto mt-20 sm:mt-32 pt-8 border-t border-border">
              <div className="flex justify-between items-center">
                {prevProject ? (
                  <Link
                    to={`/project/${prevProject.id}`}
                    onClick={() => playSound('whoosh')}
                    onMouseEnter={() => playSound('hover')}
                    className="group flex items-center gap-3"
                  >
                    <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
                    <div>
                      <span className="hud-element block text-[10px] sm:text-xs mb-1">Previous</span>
                      <span className="text-display text-xl sm:text-2xl text-foreground group-hover:text-primary transition-colors">
                        {prevProject.title}
                      </span>
                    </div>
                  </Link>
                ) : (
                  <div />
                )}

                {nextProject ? (
                  <Link
                    to={`/project/${nextProject.id}`}
                    onClick={() => playSound('whoosh')}
                    onMouseEnter={() => playSound('hover')}
                    className="group flex items-center gap-3 text-right"
                  >
                    <div>
                      <span className="hud-element block text-[10px] sm:text-xs mb-1">Next</span>
                      <span className="text-display text-xl sm:text-2xl text-foreground group-hover:text-primary transition-colors">
                        {nextProject.title}
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                ) : (
                  <div />
                )}
              </div>
            </section>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default ProjectDetail;

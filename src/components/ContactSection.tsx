import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ParallaxElement from './ParallaxElement';

gsap.registerPlugin(ScrollTrigger);

const ContactSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Heading slide in from left
      if (headingRef.current) {
        gsap.fromTo(headingRef.current,
          { x: -100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }

      // Form fields stagger animation
      if (formRef.current) {
        const formElements = formRef.current.querySelectorAll('.form-field');
        gsap.fromTo(formElements,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            stagger: 0.12,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: formRef.current,
              start: 'top 75%',
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
      id="contact" 
      ref={sectionRef}
      className="relative py-20 sm:py-32 md:py-48 px-4 sm:px-6 md:px-16"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-24">
          {/* Left Column */}
          <div>
            <ParallaxElement speed={0.15} direction="down">
              <div ref={headingRef}>
                <span className="hud-element mb-2 sm:mb-4 block text-[10px] sm:text-xs">Get In Touch</span>
                <h2 className="text-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground leading-tight">
                  LET'S CREATE <br/>
                  <span className="text-gradient">SOMETHING</span> <br/>
                  TOGETHER
                </h2>
              </div>
            </ParallaxElement>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-8 sm:mt-12 space-y-6 sm:space-y-8"
            >
              <div>
                <span className="hud-element block mb-1 sm:mb-2 text-[10px] sm:text-xs">Email</span>
                <a 
                  href="mailto:hello@beehive.net"
                  className="text-foreground text-lg sm:text-xl md:text-2xl hover:text-primary transition-colors duration-300"
                >
                  hello@beehive.net
                </a>
              </div>
              
              <div>
                <span className="hud-element block mb-1 sm:mb-2 text-[10px] sm:text-xs">Location</span>
                <p className="text-foreground text-lg sm:text-xl md:text-2xl">
                  Tirupur, India
                </p>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-8 sm:mt-12 flex flex-wrap gap-4 sm:gap-6"
            >
              {['Twitter', 'Instagram', 'LinkedIn', 'Dribbble'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="hud-element hover:text-primary transition-colors duration-300 text-[10px] sm:text-xs"
                >
                  {social}
                </a>
              ))}
            </motion.div>
          </div>

          {/* Right Column - Form */}
          <ParallaxElement speed={0.1} direction="up">
            <form ref={formRef} className="space-y-6 sm:space-y-8">
              <div className="form-field space-y-1 sm:space-y-2">
                <label className="hud-element text-[10px] sm:text-xs">Name</label>
                <input 
                  type="text"
                  className="w-full bg-transparent border-b border-border py-3 sm:py-4 text-foreground text-base sm:text-lg focus:outline-none focus:border-primary transition-colors duration-300 placeholder:text-muted-foreground"
                  placeholder="Your name"
                />
              </div>

              <div className="form-field space-y-1 sm:space-y-2">
                <label className="hud-element text-[10px] sm:text-xs">Email</label>
                <input 
                  type="email"
                  className="w-full bg-transparent border-b border-border py-3 sm:py-4 text-foreground text-base sm:text-lg focus:outline-none focus:border-primary transition-colors duration-300 placeholder:text-muted-foreground"
                  placeholder="your@email.com"
                />
              </div>

              <div className="form-field space-y-1 sm:space-y-2">
                <label className="hud-element text-[10px] sm:text-xs">Message</label>
                <textarea 
                  rows={4}
                  className="w-full bg-transparent border-b border-border py-3 sm:py-4 text-foreground text-base sm:text-lg focus:outline-none focus:border-primary transition-colors duration-300 placeholder:text-muted-foreground resize-none"
                  placeholder="Tell us about your project..."
                />
              </div>

              <button
                type="submit"
                className="form-field group relative inline-flex items-center gap-3 sm:gap-4 mt-6 sm:mt-8"
              >
                <span className="relative z-10 uppercase tracking-[0.15em] sm:tracking-[0.2em] text-xs sm:text-sm font-medium text-foreground group-hover:text-background transition-colors duration-300">
                  Send Message
                </span>
                <span className="relative z-10 w-6 sm:w-8 h-px bg-foreground group-hover:w-10 sm:group-hover:w-12 group-hover:bg-background transition-all duration-300" />
                
                {/* Button background */}
                <span className="absolute inset-0 -left-4 -right-4 -top-4 -bottom-4 bg-primary scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
              </button>
            </form>
          </ParallaxElement>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 sm:mt-32 pt-6 sm:pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <span className="hud-element text-[10px] sm:text-xs">© 2024 Active Theory. All rights reserved.</span>
          <span className="text-display text-lg sm:text-xl text-foreground">
            ACTIVE<span className="text-primary">THEORY</span>
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;

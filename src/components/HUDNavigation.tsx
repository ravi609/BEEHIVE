import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import useSoundEffects from '@/hooks/useSoundEffects';

const HUDNavigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('section-01');
  const { playSound } = useSoundEffects();

  const navItems = [
    { label: 'Work', href: '#work', section: 'work' },
    { label: 'Showreel', href: '#showreel', section: 'showreel' },
    { label: 'About', href: '#about', section: 'about' },
    { label: 'Blog', href: '#blog', section: 'blog' },
    { label: 'Team', href: '/team', section: 'team', isPage: true },
    { label: 'Contact', href: '#contact', section: 'contact' },
  ];

  // Smooth scroll with transition effect
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isPage?: boolean) => {
    if (isPage) return; // Let Link handle page navigation
    e.preventDefault();
    playSound('whoosh');
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  // Track active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['section-01', 'work', 'about', 'contact'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Top HUD Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
        <div className="flex justify-between items-center p-4 sm:p-6 md:p-8">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="pointer-events-auto"
          >
            <a 
              href="/" 
              onMouseEnter={() => playSound('hover')}
              className="text-display text-xl sm:text-2xl md:text-3xl text-foreground tracking-wider hover:text-primary transition-colors duration-300"
            >
              BEE<span className="text-primary">HIVE</span>
            </a>
          </motion.div>

          {/* Desktop Nav */}
          <motion.nav 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="hidden md:flex items-center gap-6 lg:gap-8 pointer-events-auto"
          >
            {navItems.map((item, index) => (
              item.isPage ? (
                <Link
                  key={item.label}
                  to={item.href}
                  onMouseEnter={() => playSound('hover')}
                  onClick={() => playSound('click')}
                  className="nav-link"
                >
                  {item.label}
                </Link>
              ) : (
                <motion.a
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.isPage)}
                  onMouseEnter={() => playSound('hover')}
                  className={`nav-link ${activeSection === item.section ? 'text-primary' : ''}`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                >
                  {item.label}
                </motion.a>
              )
            ))}
          </motion.nav>

          {/* Mobile Menu Button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="md:hidden pointer-events-auto flex flex-col gap-1.5 p-2"
            onClick={() => {
              setMenuOpen(!menuOpen);
              playSound('click');
            }}
            aria-label="Toggle menu"
          >
            <motion.span 
              className="w-6 h-px bg-foreground transition-transform origin-center"
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 4 : 0 }}
            />
            <motion.span 
              className="w-6 h-px bg-foreground transition-opacity"
              animate={{ opacity: menuOpen ? 0 : 1 }}
            />
            <motion.span 
              className="w-6 h-px bg-foreground transition-transform origin-center"
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -4 : 0 }}
            />
          </motion.button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm flex items-center justify-center"
          >
            <nav className="flex flex-col items-center gap-6 sm:gap-8">
              {navItems.map((item, index) => (
                item.isPage ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="text-display text-3xl sm:text-4xl text-foreground hover:text-primary transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href, item.isPage)}
                    className="text-display text-3xl sm:text-4xl text-foreground hover:text-primary transition-colors duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    {item.label}
                  </motion.a>
                )
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left Side HUD - Hidden on mobile */}
      <aside className="fixed left-4 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="hud-element [writing-mode:vertical-lr] rotate-180 text-[10px]"
        >
          Digital Experience Studio
        </motion.div>
      </aside>

      {/* Right Side HUD - Hidden on mobile and tablet */}
      <aside className="fixed right-4 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col gap-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col gap-3"
        >
          {[
            { num: '01', section: 'section-01' },
            { num: '02', section: 'work' },
            { num: '03', section: 'about' },
          ].map((item) => (
            <a 
              key={item.num}
              href={`#${item.section}`}
              onClick={(e) => handleNavClick(e, `#${item.section}`)}
              className="group flex items-center gap-2"
            >
              <span className={`hud-element group-hover:text-primary transition-colors text-[10px] ${activeSection === item.section ? 'text-primary' : ''}`}>
                {item.num}
              </span>
              <span className={`w-6 h-px bg-muted-foreground group-hover:bg-primary group-hover:w-10 transition-all duration-300 ${activeSection === item.section ? 'bg-primary w-10' : ''}`} />
            </a>
          ))}
        </motion.div>
      </aside>

      {/* Bottom HUD */}
      <footer className="fixed bottom-4 sm:bottom-6 md:bottom-8 left-4 sm:left-6 md:left-8 right-4 sm:right-6 md:right-8 z-40 pointer-events-none">
        <div className="flex justify-between items-end">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="hud-element text-[10px] sm:text-xs hidden sm:block"
          >
            Tirupur, IND
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex gap-3 sm:gap-4 pointer-events-auto"
          >
            {['Twitter', 'Instagram', 'LinkedIn'].map((social) => (
              <a 
                key={social}
                href="#"
                onMouseEnter={() => playSound('hover')}
                onClick={() => playSound('click')}
                className="hud-element hover:text-primary transition-colors duration-300 text-[10px] sm:text-xs"
              >
                {social.slice(0, 2)}
              </a>
            ))}
          </motion.div>
        </div>
      </footer>
    </>
  );
};

export default HUDNavigation;

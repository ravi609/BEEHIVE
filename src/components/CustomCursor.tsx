import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Add hover detection for interactive elements
    const handleElementHover = () => {
      const interactiveElements = document.querySelectorAll('a, button, input, textarea, [data-cursor="pointer"]');
      
      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => setCursorVariant('hover'));
        el.addEventListener('mouseleave', () => setCursorVariant('default'));
      });

      const textElements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, [data-cursor="text"]');
      textElements.forEach((el) => {
        el.addEventListener('mouseenter', () => setCursorVariant('text'));
        el.addEventListener('mouseleave', () => setCursorVariant('default'));
      });

      const imageElements = document.querySelectorAll('img, video, .project-card, [data-cursor="view"]');
      imageElements.forEach((el) => {
        el.addEventListener('mouseenter', () => setCursorVariant('view'));
        el.addEventListener('mouseleave', () => setCursorVariant('default'));
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Initial setup and mutation observer for dynamic elements
    handleElementHover();
    const observer = new MutationObserver(handleElementHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', checkMobile);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
    };
  }, []);

  // Hide on mobile
  if (isMobile) return null;

  const variants = {
    default: {
      width: 16,
      height: 16,
      backgroundColor: 'transparent',
      border: '1px solid hsl(180, 100%, 50%)',
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
    },
    hover: {
      width: 60,
      height: 60,
      backgroundColor: 'hsl(180, 100%, 50%, 0.1)',
      border: '1px solid hsl(180, 100%, 50%)',
      x: mousePosition.x - 30,
      y: mousePosition.y - 30,
    },
    text: {
      width: 4,
      height: 30,
      backgroundColor: 'hsl(180, 100%, 50%)',
      border: 'none',
      x: mousePosition.x - 2,
      y: mousePosition.y - 15,
      borderRadius: '2px',
    },
    view: {
      width: 80,
      height: 80,
      backgroundColor: 'hsl(180, 100%, 50%, 0.15)',
      border: '1px solid hsl(180, 100%, 50%)',
      x: mousePosition.x - 40,
      y: mousePosition.y - 40,
    },
  };

  return (
    <>
      {/* Main cursor */}
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
        variants={variants}
        animate={cursorVariant}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
          mass: 0.5,
        }}
        style={{
          opacity: isVisible ? 1 : 0,
        }}
      >
        {cursorVariant === 'view' && (
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="text-[10px] uppercase tracking-widest font-medium text-primary"
          >
            View
          </motion.span>
        )}
      </motion.div>

      {/* Cursor dot */}
      <motion.div
        className="fixed top-0 left-0 w-1 h-1 rounded-full bg-primary pointer-events-none z-[9999]"
        animate={{
          x: mousePosition.x - 2,
          y: mousePosition.y - 2,
          opacity: isVisible && cursorVariant !== 'text' ? 1 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 2000,
          damping: 50,
        }}
      />

      {/* Global cursor hide */}
      <style>{`
        * {
          cursor: none !important;
        }
        @media (max-width: 768px) {
          * {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  );
};

export default CustomCursor;

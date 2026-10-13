import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(onComplete, 800);
          }, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[10000] bg-background flex flex-col items-center justify-center"
        >
          {/* Grid background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'linear-gradient(hsl(180, 100%, 50%, 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(180, 100%, 50%, 0.3) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
            }} />
          </div>

          {/* Animated logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative mb-12"
          >
            {/* Logo container */}
            <div className="relative">
              {/* Glow effect */}
              <motion.div
                className="absolute inset-0 blur-2xl"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  background: 'radial-gradient(circle, hsl(180, 100%, 50%, 0.4), transparent)',
                }}
              />
              
              {/* Logo text */}
              <h1 className="text-loading-logo text-5xl md:text-7xl text-foreground relative z-10">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  BEE
                </motion.span>
                <motion.span
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-primary"
                >
                  HIVE
                </motion.span>
              </h1>
            </div>

            {/* Orbiting element */}
            <motion.div
              className="absolute -inset-8"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute top-0 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-primary rounded-full" />
            </motion.div>
          </motion.div>

          {/* Progress bar */}
          <div className="w-48 md:w-64 relative">
            <div className="h-px bg-border relative overflow-hidden">
              <motion.div
                className="h-full bg-primary origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: Math.min(progress, 100) / 100 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                style={{ boxShadow: '0 0 10px hsl(180, 100%, 50%)' }}
              />
            </div>
            
            {/* Progress text */}
            <div className="mt-4 flex justify-between items-center">
              <motion.span
                className="hud-element"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Loading
              </motion.span>
              <span className="hud-element text-primary">
                {Math.min(Math.round(progress), 100)}%
              </span>
            </div>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-8 left-8 w-16 h-16">
            <motion.div
              className="w-full h-px bg-primary origin-left"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />
            <motion.div
              className="w-px h-full bg-primary origin-top"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            />
          </div>
          <div className="absolute bottom-8 right-8 w-16 h-16">
            <motion.div
              className="w-full h-px bg-primary origin-right absolute bottom-0"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            />
            <motion.div
              className="w-px h-full bg-primary origin-bottom absolute right-0"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            />
          </div>

          {/* Scan line */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"
            animate={{ y: ['-100vh', '100vh'] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;

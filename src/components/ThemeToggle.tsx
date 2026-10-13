import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Volume2, VolumeX } from 'lucide-react';
import useSoundEffects from '@/hooks/useSoundEffects';

const ThemeToggle = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { playSound, setEnabled } = useSoundEffects();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const savedSound = localStorage.getItem('soundEnabled');
    
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('light', savedTheme === 'light');
    }
    
    if (savedSound !== null) {
      const enabled = savedSound === 'true';
      setSoundEnabled(enabled);
      setEnabled(enabled);
    }
  }, [setEnabled]);

  const toggleTheme = () => {
    playSound('click');
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.toggle('light', newTheme === 'light');
    localStorage.setItem('theme', newTheme);
  };

  const toggleSound = () => {
    const newEnabled = !soundEnabled;
    setSoundEnabled(newEnabled);
    setEnabled(newEnabled);
    localStorage.setItem('soundEnabled', String(newEnabled));
    if (newEnabled) {
      playSound('blip');
    }
  };

  return (
    <div className="fixed top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-20 z-50 flex items-center gap-2">
      {/* Sound Toggle */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        onClick={toggleSound}
        onMouseEnter={() => playSound('hover')}
        className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border border-border bg-background/50 backdrop-blur-sm hover:border-primary transition-colors duration-300 group"
        aria-label="Toggle sound"
      >
        <AnimatePresence mode="wait">
          {soundEnabled ? (
            <motion.div
              key="sound-on"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Volume2 className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </motion.div>
          ) : (
            <motion.div
              key="sound-off"
              initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <VolumeX className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Theme Toggle */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9 }}
        onClick={toggleTheme}
        onMouseEnter={() => playSound('hover')}
        className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center border border-border bg-background/50 backdrop-blur-sm hover:border-primary transition-colors duration-300 group overflow-hidden"
        aria-label="Toggle theme"
      >
        <AnimatePresence mode="wait">
          {theme === 'dark' ? (
            <motion.div
              key="moon"
              initial={{ opacity: 0, y: 20, rotate: -90 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: -20, rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              <Moon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ opacity: 0, y: 20, rotate: -90 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, y: -20, rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              <Sun className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Glow effect on theme change */}
        <motion.div
          className="absolute inset-0 bg-primary/20"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 0, opacity: 0 }}
          whileTap={{ scale: 2, opacity: [0, 0.5, 0] }}
          transition={{ duration: 0.4 }}
        />
      </motion.button>
    </div>
  );
};

export default ThemeToggle;

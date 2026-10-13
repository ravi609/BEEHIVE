import { motion } from 'framer-motion';

const ScanLine = () => {
  return (
    <div className="fixed inset-0 z-[5] pointer-events-none overflow-hidden">
      {/* Animated scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        animate={{ 
          y: ['0vh', '100vh'],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: 'linear',
        }}
      />
      
      {/* Subtle noise overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Corner brackets */}
      <div className="absolute top-8 left-8 w-8 h-8 border-l border-t border-muted-foreground/30" />
      <div className="absolute top-8 right-8 w-8 h-8 border-r border-t border-muted-foreground/30" />
      <div className="absolute bottom-8 left-8 w-8 h-8 border-l border-b border-muted-foreground/30" />
      <div className="absolute bottom-8 right-8 w-8 h-8 border-r border-b border-muted-foreground/30" />
    </div>
  );
};

export default ScanLine;

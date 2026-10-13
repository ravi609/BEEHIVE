import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import WebGLBackground from '@/components/WebGLBackground';
import HUDNavigation from '@/components/HUDNavigation';
import HeroSection from '@/components/HeroSection';
import WorkSection from '@/components/WorkSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import ScanLine from '@/components/ScanLine';
import CustomCursor from '@/components/CustomCursor';
import LoadingScreen from '@/components/LoadingScreen';
import ThemeToggle from '@/components/ThemeToggle';
import ShowreelSection from '@/components/ShowreelSection';
import BlogSection from '@/components/BlogSection';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Loading Screen */}
      <LoadingScreen onComplete={() => setIsLoading(false)} />

      {/* Main Site */}
      <AnimatePresence>
        {!isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative min-h-screen bg-background text-foreground overflow-x-hidden transition-colors duration-500"
          >
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* WebGL Background */}
            <WebGLBackground />
            
            {/* Scan Line Effect */}
            <ScanLine />
            
            {/* HUD Navigation */}
            <HUDNavigation />
            
            {/* Main Content */}
            <main className="relative z-10">
              <HeroSection />
              <WorkSection />
              <ShowreelSection />
              <AboutSection />
              <BlogSection />
              <ContactSection />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Index;

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { useSoundEffects } from '@/hooks/useSoundEffects';

gsap.registerPlugin(ScrollTrigger);

const showreelVideos = [
  {
    id: 1,
    title: 'Brand Identity',
    category: 'Branding',
    video: 'https://player.vimeo.com/external/434045526.hd.mp4?s=c27eecc69a27dbc4ff2b87d38afc35f1a9e7c02d&profile_id=175',
    poster: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=450&fit=crop'
  },
  {
    id: 2,
    title: 'Motion Graphics',
    category: 'Animation',
    video: 'https://player.vimeo.com/external/449583195.hd.mp4?s=1b66c0c08e7a8621c9c0f3a95847b31fb9a37b42&profile_id=175',
    poster: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=450&fit=crop'
  },
  {
    id: 3,
    title: 'Product Launch',
    category: 'Campaign',
    video: 'https://player.vimeo.com/external/517090081.hd.mp4?s=f8c3c0f3e94e5e7f4a3e8e9b9c9a9e7d1a1e1c1e&profile_id=175',
    poster: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop'
  },
  {
    id: 4,
    title: 'Digital Experience',
    category: 'Interactive',
    video: 'https://player.vimeo.com/external/371433846.hd.mp4?s=236da2f3c0fd273d2c6d9a064f3ae35579b2bbdf&profile_id=175',
    poster: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=450&fit=crop'
  }
];

const ShowreelSection = () => {
  const { playHover, playClick } = useSoundEffects();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeVideo, setActiveVideo] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(
        '.showreel-header',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          }
        }
      );

      // Video cards animation
      gsap.fromTo(
        '.video-card',
        { y: 80, opacity: 0, scale: 0.95 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.video-grid',
            start: 'top 80%',
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // Intersection Observer for autoplay
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              video.play().catch(() => {});
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(video);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const handleVideoClick = (index: number) => {
    playClick();
    const video = videoRefs.current[index];
    if (!video) return;

    if (activeVideo === index) {
      video.pause();
      setActiveVideo(null);
    } else {
      videoRefs.current.forEach((v, i) => {
        if (v && i !== index) v.pause();
      });
      video.play();
      setActiveVideo(index);
    }
  };

  const toggleMute = () => {
    playClick();
    setIsMuted(!isMuted);
    videoRefs.current.forEach((video) => {
      if (video) video.muted = !isMuted;
    });
  };

  return (
    <section
      ref={sectionRef}
      id="showreel"
      className="py-20 md:py-32 px-4 md:px-8 bg-muted/20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="showreel-header flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div>
            <motion.span
              className="text-primary font-mono text-sm mb-4 block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              [ SHOWREEL ]
            </motion.span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Project
              <span className="text-primary"> Highlights</span>
            </h2>
          </div>
          <button
            onClick={toggleMute}
            onMouseEnter={() => playHover()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors self-start md:self-auto"
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            <span className="font-mono text-sm">{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>
        </div>

        {/* Video Grid */}
        <div className="video-grid grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {showreelVideos.map((item, index) => (
            <div
              key={item.id}
              className="video-card group relative aspect-video rounded-xl overflow-hidden cursor-pointer bg-card"
              onMouseEnter={() => playHover()}
              onClick={() => handleVideoClick(index)}
            >
              {/* Video */}
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={item.video}
                poster={item.poster}
                muted={isMuted}
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/90 flex items-center justify-center backdrop-blur-sm"
                  initial={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {activeVideo === index ? (
                    <Pause className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground" />
                  ) : (
                    <Play className="w-6 h-6 md:w-8 md:h-8 text-primary-foreground ml-1" />
                  )}
                </motion.div>
              </div>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <span className="text-primary font-mono text-xs mb-2 block">
                  {item.category}
                </span>
                <h3 className="text-xl md:text-2xl font-bold group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
              </div>

              {/* Border Animation */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 rounded-xl transition-colors duration-500" />
            </div>
          ))}
        </div>

        {/* Full Showreel CTA */}
        <motion.div
          className="mt-12 md:mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <button
            onMouseEnter={() => playHover()}
            onClick={() => playClick()}
            className="group inline-flex items-center gap-3 px-8 py-4 border border-primary/50 rounded-full hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            <Play className="w-5 h-5" />
            <span className="font-mono">Watch Full Showreel</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ShowreelSection;

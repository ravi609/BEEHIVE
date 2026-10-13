import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, Linkedin, Twitter, Mail, MapPin, Clock, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CustomCursor from '@/components/CustomCursor';
import ThemeToggle from '@/components/ThemeToggle';
import { useSoundEffects } from '@/hooks/useSoundEffects';

gsap.registerPlugin(ScrollTrigger);

const teamMembers = [
  {
    id: 1,
    name: 'Alex Chen',
    role: 'Creative Director',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    bio: 'Visionary leader with 15+ years in digital design and brand strategy.',
    linkedin: '#',
    twitter: '#',
    email: 'alex@studio.com'
  },
  {
    id: 2,
    name: 'Sarah Kim',
    role: 'Lead Developer',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
    bio: 'Full-stack architect passionate about performant, accessible web experiences.',
    linkedin: '#',
    twitter: '#',
    email: 'sarah@studio.com'
  },
  {
    id: 3,
    name: 'Marcus Johnson',
    role: 'Motion Designer',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    bio: 'Award-winning animator bringing brands to life through motion.',
    linkedin: '#',
    twitter: '#',
    email: 'marcus@studio.com'
  },
  {
    id: 4,
    name: 'Emma Rodriguez',
    role: 'UX Strategist',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    bio: 'Human-centered designer focused on creating meaningful digital experiences.',
    linkedin: '#',
    twitter: '#',
    email: 'emma@studio.com'
  },
  {
    id: 5,
    name: 'David Park',
    role: 'Technical Lead',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    bio: 'Systems architect with expertise in scalable, modern web applications.',
    linkedin: '#',
    twitter: '#',
    email: 'david@studio.com'
  },
  {
    id: 6,
    name: 'Luna Martinez',
    role: 'Brand Designer',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
    bio: 'Visual storyteller crafting memorable brand identities worldwide.',
    linkedin: '#',
    twitter: '#',
    email: 'luna@studio.com'
  }
];

const jobListings = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Remote / San Francisco',
    type: 'Full-time',
    description: 'Build cutting-edge web experiences with React, TypeScript, and modern animation libraries.'
  },
  {
    id: 2,
    title: 'Motion Designer',
    department: 'Design',
    location: 'Los Angeles',
    type: 'Full-time',
    description: 'Create stunning motion graphics and animations for digital campaigns.'
  },
  {
    id: 3,
    title: 'UX/UI Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    description: 'Design intuitive, beautiful interfaces for web and mobile applications.'
  },
  {
    id: 4,
    title: 'Project Manager',
    department: 'Operations',
    location: 'New York',
    type: 'Full-time',
    description: 'Lead cross-functional teams to deliver exceptional digital projects.'
  }
];

const TeamPage = () => {
  const { playHover, playClick } = useSoundEffects();
  const teamRef = useRef<HTMLDivElement>(null);
  const jobsRef = useRef<HTMLDivElement>(null);
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Team members animation
      gsap.fromTo(
        '.team-member',
        { y: 100, opacity: 0, scale: 0.9 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: teamRef.current,
            start: 'top 80%',
          }
        }
      );

      // Job listings animation
      gsap.fromTo(
        '.job-card',
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: jobsRef.current,
            start: 'top 80%',
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background text-foreground"
    >
      <CustomCursor />
      <ThemeToggle />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
          onMouseEnter={() => playHover()}
          onClick={() => playClick()}
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-mono">Back to Home</span>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
              Meet Our
              <span className="block text-primary">Team</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
              We're a collective of dreamers, designers, and developers passionate about creating digital experiences that matter.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="py-20 px-4 md:px-8" ref={teamRef}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">The Crew</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {teamMembers.map((member) => (
              <Card
                key={member.id}
                className="team-member group overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-500"
                onMouseEnter={() => {
                  setHoveredMember(member.id);
                  playHover();
                }}
                onMouseLeave={() => setHoveredMember(null)}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden aspect-[4/5]">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    
                    {/* Overlay Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                      <p className="text-primary font-mono text-sm mb-3">{member.role}</p>
                      <p className="text-muted-foreground text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {member.bio}
                      </p>
                      
                      {/* Social Links */}
                      <div className="flex gap-3 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                        <a
                          href={member.linkedin}
                          className="p-2 bg-background/80 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            playClick();
                          }}
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                        <a
                          href={member.twitter}
                          className="p-2 bg-background/80 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            playClick();
                          }}
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                        <a
                          href={`mailto:${member.email}`}
                          className="p-2 bg-background/80 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            playClick();
                          }}
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section className="py-20 px-4 md:px-8 bg-muted/30" ref={jobsRef}>
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Open Positions</h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Join our team and help shape the future of digital experiences. We're always looking for talented individuals.
            </p>
          </div>

          <div className="space-y-4">
            {jobListings.map((job) => (
              <Card
                key={job.id}
                className="job-card group bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer"
                onMouseEnter={() => playHover()}
                onClick={() => playClick()}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                          {job.title}
                        </h3>
                        <span className="px-2 py-1 text-xs font-mono bg-primary/10 text-primary rounded">
                          {job.department}
                        </span>
                      </div>
                      <p className="text-muted-foreground mb-3">{job.description}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {job.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {job.department}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    >
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Don't see the right fit?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            We're always interested in hearing from talented people. Send us your portfolio and let's chat.
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90"
            onMouseEnter={() => playHover()}
            onClick={() => playClick()}
          >
            Get in Touch
          </Button>
        </div>
      </section>
    </motion.div>
  );
};

export default TeamPage;

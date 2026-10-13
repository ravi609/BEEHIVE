import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Clock, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useSoundEffects } from '@/hooks/useSoundEffects';

gsap.registerPlugin(ScrollTrigger);

export const blogPosts = [
  {
    id: 1,
    slug: 'future-of-web-design-2024',
    title: 'The Future of Web Design in 2024',
    excerpt: 'Exploring emerging trends, technologies, and design philosophies shaping the digital landscape.',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=500&fit=crop',
    category: 'Design',
    author: 'Alex Chen',
    date: 'Jan 15, 2024',
    readTime: '5 min read',
    content: `
      <p>The web design landscape is evolving at an unprecedented pace. As we step into 2024, several key trends are reshaping how we think about digital experiences.</p>
      
      <h2>AI-Powered Design</h2>
      <p>Artificial intelligence is no longer just a buzzword—it's becoming an integral part of the design process. From generating layouts to optimizing user flows, AI tools are augmenting designers' capabilities.</p>
      
      <h2>Immersive Experiences</h2>
      <p>WebGL, Three.js, and other 3D technologies are pushing boundaries. We're seeing more websites incorporate immersive elements that blur the line between web and native applications.</p>
      
      <h2>Sustainable Design</h2>
      <p>With growing awareness of digital carbon footprints, designers are prioritizing performance and efficiency. Dark modes, optimized assets, and eco-friendly hosting are becoming standard considerations.</p>
      
      <h2>Micro-Interactions</h2>
      <p>Subtle animations and transitions continue to play a crucial role in creating delightful user experiences. The key is balance—enhancing usability without overwhelming users.</p>
    `
  },
  {
    id: 2,
    slug: 'mastering-motion-design',
    title: 'Mastering Motion Design for the Web',
    excerpt: 'A comprehensive guide to creating fluid, purposeful animations that enhance user experience.',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=500&fit=crop',
    category: 'Animation',
    author: 'Marcus Johnson',
    date: 'Jan 10, 2024',
    readTime: '8 min read',
    content: `
      <p>Motion design has become essential in modern web development. When done right, animations guide users, provide feedback, and create memorable experiences.</p>
      
      <h2>Principles of Motion</h2>
      <p>Understanding the 12 principles of animation—originally developed by Disney animators—provides a solid foundation for web motion design.</p>
      
      <h2>Performance Matters</h2>
      <p>Beautiful animations mean nothing if they cause jank or slow down your site. Learn to leverage GPU acceleration, optimize for 60fps, and use will-change wisely.</p>
      
      <h2>Tools of the Trade</h2>
      <p>From CSS animations to GSAP, Framer Motion to Lottie—each tool has its strengths. We'll explore when to use what for optimal results.</p>
    `
  },
  {
    id: 3,
    slug: 'building-design-systems',
    title: 'Building Scalable Design Systems',
    excerpt: 'How to create and maintain design systems that grow with your organization.',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&h=500&fit=crop',
    category: 'Systems',
    author: 'Sarah Kim',
    date: 'Jan 5, 2024',
    readTime: '6 min read',
    content: `
      <p>Design systems are the backbone of consistent, efficient product development. But building one that scales requires careful planning and ongoing maintenance.</p>
      
      <h2>Start with Principles</h2>
      <p>Before diving into components, establish clear design principles that will guide all decisions. These become your north star.</p>
      
      <h2>Token-Based Architecture</h2>
      <p>Design tokens—colors, spacing, typography—form the foundation. They ensure consistency across platforms and make global changes painless.</p>
      
      <h2>Documentation is Key</h2>
      <p>A design system is only as good as its documentation. Make it searchable, keep it updated, and include real-world examples.</p>
    `
  },
  {
    id: 4,
    slug: 'accessibility-first-design',
    title: 'Accessibility-First Design Approach',
    excerpt: 'Why designing for accessibility benefits everyone and how to implement it effectively.',
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&h=500&fit=crop',
    category: 'Accessibility',
    author: 'Emma Rodriguez',
    date: 'Dec 28, 2023',
    readTime: '7 min read',
    content: `
      <p>Accessibility isn't an afterthought—it's a fundamental aspect of good design. When we design for the edges, we create better experiences for everyone.</p>
      
      <h2>Understanding WCAG</h2>
      <p>The Web Content Accessibility Guidelines provide a framework for accessible design. Let's break down the key principles: Perceivable, Operable, Understandable, and Robust.</p>
      
      <h2>Practical Implementation</h2>
      <p>From semantic HTML to ARIA attributes, from color contrast to keyboard navigation—we'll cover practical techniques for building accessible interfaces.</p>
    `
  }
];

const BlogSection = () => {
  const { playHover, playClick } = useSoundEffects();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.blog-header',
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

      gsap.fromTo(
        '.blog-card',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.blog-grid',
            start: 'top 80%',
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="blog"
      className="py-20 md:py-32 px-4 md:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="blog-header flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div>
            <motion.span
              className="text-primary font-mono text-sm mb-4 block"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              [ INSIGHTS ]
            </motion.span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Latest
              <span className="text-primary"> Articles</span>
            </h2>
          </div>
          <Link
            to="/blog"
            onMouseEnter={() => playHover()}
            onClick={() => playClick()}
            className="group inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <span className="font-mono text-sm">View All Articles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Blog Grid */}
        <div className="blog-grid grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Featured Post */}
          <Link
            to={`/blog/${blogPosts[0].slug}`}
            className="blog-card md:col-span-2 group"
            onMouseEnter={() => playHover()}
            onClick={() => playClick()}
          >
            <Card className="overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-500">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="relative aspect-video md:aspect-auto overflow-hidden">
                    <img
                      src={blogPosts[0].image}
                      alt={blogPosts[0].title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/80 hidden md:block" />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <span className="text-primary font-mono text-xs mb-3">
                      {blogPosts[0].category}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {blogPosts[0].title}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {blogPosts[0].excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {blogPosts[0].author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {blogPosts[0].readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Other Posts */}
          {blogPosts.slice(1).map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.slug}`}
              className="blog-card group"
              onMouseEnter={() => playHover()}
              onClick={() => playClick()}
            >
              <Card className="h-full overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-500">
                <CardContent className="p-0">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 bg-primary/90 text-primary-foreground text-xs font-mono rounded">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post.date}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;

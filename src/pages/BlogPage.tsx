import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, Clock, User, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import CustomCursor from '@/components/CustomCursor';
import ThemeToggle from '@/components/ThemeToggle';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { blogPosts } from '@/components/BlogSection';

gsap.registerPlugin(ScrollTrigger);

const categories = ['All', 'Design', 'Animation', 'Systems', 'Accessibility'];

const BlogPage = () => {
  const { playHover, playClick } = useSoundEffects();
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.blog-card-item',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 80%',
          }
        }
      );
    });

    return () => ctx.revert();
  }, [filteredPosts]);

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
      <header className="fixed top-0 left-0 right-0 z-50 p-4 md:p-6 bg-background/80 backdrop-blur-md">
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

      {/* Hero */}
      <section className="pt-32 pb-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
              Our
              <span className="text-primary"> Blog</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
              Insights, tutorials, and thoughts on design, development, and the digital world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="px-4 md:px-8 py-8 border-y border-border/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  playClick();
                  setActiveCategory(category);
                }}
                onMouseEnter={() => playHover()}
                className={`px-4 py-2 rounded-full text-sm font-mono transition-all ${
                  activeCategory === category
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary outline-none transition-colors w-full md:w-64"
            />
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 px-4 md:px-8" ref={gridRef}>
        <div className="max-w-7xl mx-auto">
          {filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredPosts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="blog-card-item group"
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
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {post.author}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {post.readTime}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No articles found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
};

export default BlogPage;

import { useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, Clock, User, Calendar, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CustomCursor from '@/components/CustomCursor';
import ThemeToggle from '@/components/ThemeToggle';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { blogPosts } from '@/components/BlogSection';

gsap.registerPlugin(ScrollTrigger);

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { playHover, playClick } = useSoundEffects();
  const contentRef = useRef<HTMLDivElement>(null);

  const post = blogPosts.find((p) => p.slug === slug);
  const currentIndex = blogPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null;

  useEffect(() => {
    if (!post) {
      navigate('/blog');
      return;
    }

    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.post-content > *',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
          }
        }
      );
    });

    return () => ctx.revert();
  }, [post, navigate]);

  if (!post) return null;

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
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            to="/#blog"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
            onMouseEnter={() => playHover()}
            onClick={() => playClick()}
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-mono">Back to Articles</span>
          </Link>
          <button
            onMouseEnter={() => playHover()}
            onClick={() => {
              playClick();
              navigator.share?.({ title: post.title, url: window.location.href });
            }}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-24 pb-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="text-primary font-mono text-sm mb-4 block">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-muted-foreground mb-8">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <motion.div
        className="w-full max-w-6xl mx-auto px-4 md:px-8 mb-12"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="aspect-video rounded-xl overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      {/* Content */}
      <article className="px-4 md:px-8 pb-20" ref={contentRef}>
        <div
          className="post-content max-w-3xl mx-auto prose prose-lg dark:prose-invert prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* Navigation */}
      <section className="border-t border-border py-12 px-4 md:px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {prevPost ? (
            <Link
              to={`/blog/${prevPost.slug}`}
              className="group p-6 rounded-xl bg-card/50 border border-border/50 hover:border-primary/50 transition-all"
              onMouseEnter={() => playHover()}
              onClick={() => playClick()}
            >
              <span className="text-muted-foreground text-sm flex items-center gap-2 mb-2">
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Previous Article
              </span>
              <h4 className="font-bold group-hover:text-primary transition-colors">
                {prevPost.title}
              </h4>
            </Link>
          ) : (
            <div />
          )}
          {nextPost && (
            <Link
              to={`/blog/${nextPost.slug}`}
              className="group p-6 rounded-xl bg-card/50 border border-border/50 hover:border-primary/50 transition-all text-right"
              onMouseEnter={() => playHover()}
              onClick={() => playClick()}
            >
              <span className="text-muted-foreground text-sm flex items-center justify-end gap-2 mb-2">
                Next Article
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <h4 className="font-bold group-hover:text-primary transition-colors">
                {nextPost.title}
              </h4>
            </Link>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 md:px-8 bg-muted/30">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Enjoyed this article?
          </h3>
          <p className="text-muted-foreground mb-8">
            Subscribe to our newsletter for the latest insights and updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 rounded-lg bg-background border border-border focus:border-primary outline-none transition-colors"
            />
            <Button
              className="bg-primary hover:bg-primary/90"
              onMouseEnter={() => playHover()}
              onClick={() => playClick()}
            >
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default BlogPost;

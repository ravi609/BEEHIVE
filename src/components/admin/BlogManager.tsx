import { useState, useEffect, useMemo } from 'react';
import { Plus, Edit, Trash2, Loader2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { blogService, categoryService, BlogPost } from '@/lib/firebaseServices';
import { toast } from 'sonner';
import RichTextEditor from './RichTextEditor';
import ImageUpload from './ImageUpload';
import BlogPreview from './BlogPreview';
import CategoryTagInput from './CategoryTagInput';

const BlogManager = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);
  const [categorySuggestions, setCategorySuggestions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image: '',
    category: '',
    tags: [] as string[],
    author: '',
    date: '',
    readTime: ''
  });

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await blogService.getAll();
      setBlogs(data);
    } catch (error) {
      toast.error('Failed to fetch blog posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categories = await categoryService.getAll();
      setCategorySuggestions(categories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  // Extract all unique tags from existing blogs for suggestions
  const tagSuggestions = useMemo(() => {
    const allTags = blogs.flatMap(blog => blog.tags || []);
    return [...new Set(allTags)];
  }, [blogs]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Save category for future autocomplete
      if (formData.category) {
        await categoryService.add(formData.category);
      }

      if (selectedBlog?.id) {
        await blogService.update(selectedBlog.id, formData);
        toast.success('Blog post updated successfully');
      } else {
        await blogService.create(formData);
        toast.success('Blog post created successfully');
      }
      setDialogOpen(false);
      resetForm();
      fetchBlogs();
      fetchCategories();
    } catch (error) {
      toast.error('Failed to save blog post');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (blog: BlogPost) => {
    setSelectedBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      image: blog.image,
      category: blog.category,
      tags: blog.tags || [],
      author: blog.author,
      date: blog.date,
      readTime: blog.readTime
    });
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedBlog?.id) return;

    try {
      await blogService.delete(selectedBlog.id);
      toast.success('Blog post deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedBlog(null);
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to delete blog post');
    }
  };

  const resetForm = () => {
    setSelectedBlog(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      image: '',
      category: '',
      tags: [],
      author: '',
      date: '',
      readTime: ''
    });
  };

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-muted-foreground">{blogs.length} blog posts</p>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedBlog ? 'Edit Blog Post' : 'Add Blog Post'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) });
                    }}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  rows={2}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Content</Label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData({ ...formData, content })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Featured Image</Label>
                  <ImageUpload
                    value={formData.image}
                    onChange={(image) => setFormData({ ...formData, image })}
                    folder="blog-images"
                  />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      list="category-suggestions"
                      required
                    />
                    <datalist id="category-suggestions">
                      {categorySuggestions.map((cat) => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>
                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <CategoryTagInput
                      value={formData.tags}
                      onChange={(tags) => setFormData({ ...formData, tags })}
                      suggestions={tagSuggestions}
                      placeholder="Add tags..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    placeholder="Jan 15, 2024"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="readTime">Read Time</Label>
                  <Input
                    id="readTime"
                    value={formData.readTime}
                    onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                    placeholder="5 min read"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-between gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setPreviewOpen(true)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    {selectedBlog ? 'Update' : 'Create'}
                  </Button>
                </div>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {blogs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No blog posts yet. Create your first one!
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {blogs.map((blog) => (
            <Card key={blog.id} className="overflow-hidden">
              <CardContent className="p-4 flex items-center gap-4">
                {blog.image && (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{blog.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{blog.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{blog.category}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{blog.date}</span>
                    {blog.tags && blog.tags.length > 0 && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        {blog.tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                        {blog.tags.length > 3 && (
                          <span className="text-xs text-muted-foreground">+{blog.tags.length - 3}</span>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(blog)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setSelectedBlog(blog);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blog Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedBlog?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BlogPreview 
        open={previewOpen} 
        onOpenChange={setPreviewOpen}
        post={formData}
      />
    </div>
  );
};

export default BlogManager;

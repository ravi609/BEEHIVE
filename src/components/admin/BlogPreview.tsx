import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BlogPreviewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: {
    title: string;
    excerpt: string;
    content: string;
    image: string;
    category: string;
    author: string;
    date: string;
    readTime: string;
    tags?: string[];
  };
}

const BlogPreview = ({ open, onOpenChange, post }: BlogPreviewProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <span>Preview</span>
            <Badge variant="secondary">Draft</Badge>
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="h-[calc(90vh-80px)]">
          <article className="p-6 pt-4">
            {post.image && (
              <div className="relative aspect-video mb-6 overflow-hidden rounded-lg">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <Badge variant="outline">{post.category || 'Uncategorized'}</Badge>
                {post.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <h1 className="text-3xl font-bold tracking-tight">
                {post.title || 'Untitled Post'}
              </h1>
              
              <p className="text-lg text-muted-foreground">
                {post.excerpt || 'No excerpt provided'}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground border-y border-border py-4">
                <span>By {post.author || 'Unknown Author'}</span>
                <span>•</span>
                <span>{post.date || 'No date'}</span>
                <span>•</span>
                <span>{post.readTime || '5 min read'}</span>
              </div>
              
              <div 
                className="prose prose-neutral dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: post.content || '<p class="text-muted-foreground italic">No content yet...</p>' 
                }}
              />
            </div>
          </article>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default BlogPreview;

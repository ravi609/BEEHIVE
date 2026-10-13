import { useState, useRef, forwardRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { storageService } from '@/lib/storageService';
import { toast } from 'sonner';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  className?: string;
}

const ImageUpload = forwardRef<HTMLDivElement, ImageUploadProps>(
  ({ value, onChange, folder = "images", className = "" }, ref) => {
    const [uploading, setUploading] = useState(false);
    const [showUrlInput, setShowUrlInput] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image must be less than 10MB');
        return;
      }

      setUploading(true);
      try {
        const url = await storageService.uploadImage(file, folder);
        onChange(url);
        toast.success('Image uploaded successfully');
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload image');
      } finally {
        setUploading(false);
      }
    };

    const handleRemove = () => {
      onChange('');
    };

    return (
      <div ref={ref} className={`space-y-2 ${className}`}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {value ? (
          <div className="relative group">
            <img
              src={value}
              alt="Preview"
              className="w-full h-40 object-cover rounded-lg border border-border"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-lg">
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                Replace
              </Button>
              <Button
                type="button"
                size="sm"
                variant="destructive"
                onClick={handleRemove}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              className="w-full h-40 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Uploading...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Click to upload image</span>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">or</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowUrlInput(!showUrlInput)}
              >
                Enter URL manually
              </Button>
            </div>

            {showUrlInput && (
              <Input
                placeholder="https://example.com/image.jpg"
                value={value}
                onChange={(e) => onChange(e.target.value)}
              />
            )}
          </div>
        )}
      </div>
    );
  }
);

ImageUpload.displayName = 'ImageUpload';

export default ImageUpload;

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Loader2, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { showreelService, Showreel } from '@/lib/firebaseServices';
import { toast } from 'sonner';
import ImageUpload from './ImageUpload';
import SortableItem from './SortableItem';

const ShowreelManager = () => {
  const [showreels, setShowreels] = useState<Showreel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedShowreel, setSelectedShowreel] = useState<Showreel | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    video: '',
    poster: ''
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchShowreels();
  }, []);

  const fetchShowreels = async () => {
    try {
      setLoading(true);
      const data = await showreelService.getAll();
      // Sort by order if available
      const sorted = data.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
      setShowreels(sorted);
    } catch (error) {
      toast.error('Failed to fetch showreels');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = showreels.findIndex((s) => s.id === active.id);
      const newIndex = showreels.findIndex((s) => s.id === over.id);
      
      const newOrder = arrayMove(showreels, oldIndex, newIndex);
      setShowreels(newOrder);
      
      // Persist order to Firebase
      try {
        await Promise.all(
          newOrder.map((showreel, index) =>
            showreel.id ? showreelService.update(showreel.id, { order: index }) : Promise.resolve()
          )
        );
        toast.success('Order saved');
      } catch (error) {
        toast.error('Failed to save order');
        fetchShowreels(); // Revert on error
      }
    }
  }, [showreels]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (selectedShowreel?.id) {
        await showreelService.update(selectedShowreel.id, formData);
        toast.success('Showreel updated successfully');
      } else {
        await showreelService.create({ ...formData, order: showreels.length });
        toast.success('Showreel added successfully');
      }
      setDialogOpen(false);
      resetForm();
      fetchShowreels();
    } catch (error) {
      toast.error('Failed to save showreel');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (showreel: Showreel) => {
    setSelectedShowreel(showreel);
    setFormData({
      title: showreel.title,
      category: showreel.category,
      video: showreel.video,
      poster: showreel.poster
    });
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedShowreel?.id) return;

    try {
      await showreelService.delete(selectedShowreel.id);
      toast.success('Showreel deleted successfully');
      setDeleteDialogOpen(false);
      setSelectedShowreel(null);
      fetchShowreels();
    } catch (error) {
      toast.error('Failed to delete showreel');
    }
  };

  const resetForm = () => {
    setSelectedShowreel(null);
    setFormData({
      title: '',
      category: '',
      video: '',
      poster: ''
    });
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
        <p className="text-muted-foreground">{showreels.length} showreels • Drag to reorder</p>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Showreel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedShowreel ? 'Edit Showreel' : 'Add Showreel'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Brand Identity"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Branding"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video">Video URL</Label>
                <Input
                  id="video"
                  value={formData.video}
                  onChange={(e) => setFormData({ ...formData, video: e.target.value })}
                  placeholder="https://..."
                  required
                />
                <p className="text-xs text-muted-foreground">Direct video URL (MP4 format recommended)</p>
              </div>

              <div className="space-y-2">
                <Label>Poster Image</Label>
                <ImageUpload
                  value={formData.poster}
                  onChange={(poster) => setFormData({ ...formData, poster })}
                  folder="showreel-posters"
                />
                <p className="text-xs text-muted-foreground">Thumbnail image shown before video plays</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {selectedShowreel ? 'Update' : 'Add'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {showreels.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No showreels yet. Add your first one!
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={showreels.map(s => s.id!)} 
            strategy={rectSortingStrategy}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              {showreels.map((showreel) => (
                <SortableItem key={showreel.id} id={showreel.id!}>
                  <Card className="overflow-hidden h-full">
                    <div className="relative aspect-video bg-muted">
                      {showreel.poster && (
                        <img
                          src={showreel.poster}
                          alt={showreel.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-primary/80 flex items-center justify-center">
                          <Play className="w-5 h-5 text-primary-foreground ml-0.5" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{showreel.title}</h3>
                          <p className="text-sm text-primary">{showreel.category}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEdit(showreel)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedShowreel(showreel);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Showreel</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedShowreel?.title}"? This action cannot be undone.
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
    </div>
  );
};

export default ShowreelManager;

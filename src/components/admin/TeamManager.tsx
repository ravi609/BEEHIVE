import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { teamService, TeamMember } from '@/lib/firebaseServices';
import { toast } from 'sonner';
import ImageUpload from './ImageUpload';
import SortableItem from './SortableItem';

const TeamManager = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    image: '',
    bio: '',
    social: {
      linkedin: '',
      twitter: '',
      dribbble: ''
    }
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
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const data = await teamService.getAll();
      // Sort by order if available
      const sorted = data.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
      setTeam(sorted);
    } catch (error) {
      toast.error('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = team.findIndex((m) => m.id === active.id);
      const newIndex = team.findIndex((m) => m.id === over.id);
      
      const newOrder = arrayMove(team, oldIndex, newIndex);
      setTeam(newOrder);
      
      // Persist order to Firebase
      try {
        await Promise.all(
          newOrder.map((member, index) =>
            member.id ? teamService.update(member.id, { order: index }) : Promise.resolve()
          )
        );
        toast.success('Order saved');
      } catch (error) {
        toast.error('Failed to save order');
        fetchTeam(); // Revert on error
      }
    }
  }, [team]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (selectedMember?.id) {
        await teamService.update(selectedMember.id, formData);
        toast.success('Team member updated successfully');
      } else {
        await teamService.create({ ...formData, order: team.length });
        toast.success('Team member added successfully');
      }
      setDialogOpen(false);
      resetForm();
      fetchTeam();
    } catch (error) {
      toast.error('Failed to save team member');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      image: member.image,
      bio: member.bio,
      social: {
        linkedin: member.social?.linkedin || '',
        twitter: member.social?.twitter || '',
        dribbble: member.social?.dribbble || ''
      }
    });
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedMember?.id) return;

    try {
      await teamService.delete(selectedMember.id);
      toast.success('Team member removed successfully');
      setDeleteDialogOpen(false);
      setSelectedMember(null);
      fetchTeam();
    } catch (error) {
      toast.error('Failed to delete team member');
    }
  };

  const resetForm = () => {
    setSelectedMember(null);
    setFormData({
      name: '',
      role: '',
      image: '',
      bio: '',
      social: { linkedin: '', twitter: '', dribbble: '' }
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
        <p className="text-muted-foreground">{team.length} team members • Drag to reorder</p>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Team Member
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedMember ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Profile Image</Label>
                <ImageUpload
                  value={formData.image}
                  onChange={(image) => setFormData({ ...formData, image })}
                  folder="team-images"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Social Links (optional)</Label>
                <div className="space-y-2">
                  <Input
                    placeholder="LinkedIn URL"
                    value={formData.social.linkedin}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      social: { ...formData.social, linkedin: e.target.value }
                    })}
                  />
                  <Input
                    placeholder="Twitter URL"
                    value={formData.social.twitter}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      social: { ...formData.social, twitter: e.target.value }
                    })}
                  />
                  <Input
                    placeholder="Dribbble URL"
                    value={formData.social.dribbble}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      social: { ...formData.social, dribbble: e.target.value }
                    })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {selectedMember ? 'Update' : 'Add'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {team.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No team members yet. Add your first one!
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={team.map(m => m.id!)} 
            strategy={rectSortingStrategy}
          >
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {team.map((member) => (
                <SortableItem key={member.id} id={member.id!}>
                  <Card className="overflow-hidden h-full">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4 mb-3">
                        {member.image && (
                          <img
                            src={member.image}
                            alt={member.name}
                            className="w-16 h-16 object-cover rounded-full"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{member.name}</h3>
                          <p className="text-sm text-primary">{member.role}</p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{member.bio}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(member)} className="flex-1">
                          <Edit className="w-4 h-4 mr-1" /> Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedMember(member);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
            <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{selectedMember?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TeamManager;

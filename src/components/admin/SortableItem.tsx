import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SortableItemProps {
  id: string;
  children: ReactNode;
  className?: string;
}

const SortableItem = ({ id, children, className }: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group",
        isDragging && "z-50 opacity-90 shadow-xl",
        className
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-gradient-to-r from-background/80 to-transparent"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="pl-6">
        {children}
      </div>
    </div>
  );
};

export default SortableItem;

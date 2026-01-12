import type { FunctionComponent, ReactNode } from "react";
import { GripVertical } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useDragAndDrop } from "~/hooks/useDragAndDrop";

interface DraggableCardProps {
  id: string;
  children: ReactNode;
  onReorder: (draggedId: string, targetId: string) => void;
  className?: string;
}

export const DraggableCard: FunctionComponent<DraggableCardProps> = ({
  id,
  children,
  onReorder,
  className = "",
}) => {
  const { handleDragOver, handleDrop, getDragHandleProps } = useDragAndDrop();

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop(id, onReorder)}
      className={`group relative transition-all duration-200 ${className}`}
    >
      {/* Drag Handle Button */}
      <div className="absolute top-3 right-3 z-10 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <Button
          variant="ghost"
          size="sm"
          {...getDragHandleProps({ id, type: "card" })}
          title="Drag to reorder"
          className="hover:bg-background/80 border-border/50 h-8 w-8 cursor-grab border p-0 backdrop-blur-sm active:cursor-grabbing"
        >
          <GripVertical className="text-muted-foreground h-4 w-4" />
        </Button>
      </div>

      {/* Card Content */}
      <div className="relative">{children}</div>
    </div>
  );
};

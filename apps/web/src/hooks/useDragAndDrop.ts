import { useCallback, useState } from "react";
import type { DragEvent, DragEventHandler } from "react";

interface DragItem {
  id: string;
  type: string;
}

interface UseDragAndDropResult {
  draggedItem: DragItem | null;
  isDragging: boolean;
  handleDragStart: (item: DragItem) => DragEventHandler<HTMLElement>;
  handleDragEnd: () => void;
  handleDragOver: DragEventHandler<HTMLElement>;
  handleDrop: (
    targetId: string,
    onDrop: (draggedId: string, targetId: string) => void,
  ) => (e: DragEvent<HTMLElement>) => void;
  getDragHandleProps: (item: DragItem) => {
    draggable: boolean;
    onDragStart: (e: DragEvent<HTMLElement>) => void;
    onDragEnd: () => void;
    className: string;
    "data-drag-handle": string;
  };
}

export const useDragAndDrop = (): UseDragAndDropResult => {
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);

  const handleDragStart = useCallback(
    (item: DragItem) => (e: DragEvent<HTMLElement>) => {
      setDraggedItem(item);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", JSON.stringify(item));

      // Add visual feedback to the drag handle
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.style.opacity = "0.5";
      }
    },
    [],
  );

  const handleDragEnd = useCallback(() => {
    setDraggedItem(null);

    // Reset visual feedback for drag handles
    document.querySelectorAll('[data-drag-handle="true"]').forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.opacity = "1";
      }
    });
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (targetId: string, onDrop: (draggedId: string, targetId: string) => void) =>
      (e: DragEvent<HTMLElement>) => {
        e.preventDefault();

        try {
          const data = e.dataTransfer.getData("text/plain");
          const draggedItem = JSON.parse(data) as DragItem;

          if (draggedItem.id !== targetId) {
            onDrop(draggedItem.id, targetId);
          }
        } catch (error) {
          console.error("Error parsing drag data:", error);
        }

        setDraggedItem(null);
      },
    [],
  );

  const getDragHandleProps = useCallback(
    (item: DragItem) => ({
      draggable: true,
      onDragStart: handleDragStart(item),
      onDragEnd: handleDragEnd,
      className: "cursor-grab active:cursor-grabbing",
      "data-drag-handle": "true",
    }),
    [handleDragStart, handleDragEnd],
  );

  return {
    draggedItem,
    isDragging: draggedItem !== null,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDrop,
    getDragHandleProps,
  };
};

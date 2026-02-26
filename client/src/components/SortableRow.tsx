import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Props } from "../types/widget";
import * as React from "react";

// Sortable row for HTML tables. Applies dnd-kit bindings directly to <tr>
const SortableRow = ({ id, children }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      aria-grabbed={isDragging}
      className={`${isOver ? "outline outline-2 outline-blue-300" : ""} ${isDragging ? "opacity-80" : ""}`}
    >
      {children}
    </tr>
  );
};

export default SortableRow;

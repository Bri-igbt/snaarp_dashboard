import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Props } from "../types/widget";
import * as React from "react";

const SortableItem = ({ id, children }: Props) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        isOver,
    } = useSortable({ id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        role="button"
        tabIndex={0}
        aria-grabbed={isDragging}
        aria-pressed={isDragging}
        className={`cursor-grab active:cursor-grabbing outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-xl ${isOver ? "ring-2 ring-blue-300" : ""}`}
        >
        {children}
        </div>
    );
}

export default SortableItem
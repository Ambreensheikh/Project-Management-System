"use client";

import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { useDndContext, type UniqueIdentifier } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import { TaskCard } from "./TaskCard";

interface KanbanColumnProps {
  column: {
    id: UniqueIdentifier;
    title: string;
    items: {
      id: UniqueIdentifier;
      title: string;
      description: string;
      priority: "Low" | "Medium" | "High";
    }[];
  };
}

export function KanbanColumn({ column }: KanbanColumnProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Container",
      column,
    },
  });

  const tasksIds = useMemo(() => {
    return column.items.map((task) => task.id);
  }, [column.items]);

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`w-full h-full p-4 bg-gray-900/40 rounded-xl flex flex-col gap-y-4 border border-gray-800/60 ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <div
        {...attributes}
        {...listeners}
        className="flex items-center justify-between"
      >
        <h1 className="text-gray-50 text-xl">{column.title}</h1>
      </div>
      <SortableContext items={tasksIds}>
        <div className="flex flex-col gap-y-4">
          {column.items.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cva } from "class-variance-authority";
import { Badge } from "@/app/components/ui/Badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/Card";
import { UniqueIdentifier } from "@dnd-kit/core";

interface TaskCardProps {
  task: {
    id: UniqueIdentifier;
    title: string;
    description: string;
    priority: "Low" | "Medium" | "High";
  };
}

export function TaskCard({ task }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="px-3 py-3 space-between flex flex-row border-b">
        <CardTitle
          {...attributes}
          {...listeners}
          className="text-sm font-semibold text-gray-50"
        >
          {task.title}
        </CardTitle>
        <Badge
          className={`ml-auto ${
            task.priority === "High"
              ? "bg-red-500/20 text-red-400"
              : task.priority === "Medium"
              ? "bg-yellow-500/20 text-yellow-400"
              : "bg-green-500/20 text-green-400"
          }`}
        >
          {task.priority}
        </Badge>
      </CardHeader>
      <CardContent className="px-3 py-3 text-xs text-gray-400">
        <p>{task.description}</p>
      </CardContent>
    </Card>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import Sidebar from "@/app/components/dashboard/Sidebar";
import Navbar from "@/app/components/dashboard/Navbar";
import { KanbanColumn } from "@/app/components/kanban/KanbanColumn";
import { TaskCard } from "@/app/components/kanban/TaskCard";
import { Skeleton } from "@/app/components/ui/Skeleton";

interface Task {
  id: UniqueIdentifier;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High";
  status: "To Do" | "In Progress" | "Done";
}

interface Column {
  id: UniqueIdentifier;
  title: string;
  items: Task[];
}

export default function ProjectsPage() {
  const [columns, setColumns] = useState<Column[]>(() => [
    { id: "To Do", title: "To Do", items: [] },
    { id: "In Progress", title: "In Progress", items: [] },
    { id: "Done", title: "Done", items: [] },
  ]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:8001/api/v1/projects");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const apiResponse = await response.json();
        const tasks = apiResponse.data.map((project: any) => ({
          id: project._id,
          title: project.name,
          description: project.description,
          priority: project.tags?.[0] || "Medium", // Assuming tags determine priority
          status: project.status || "To Do",
        }));

        setColumns((prevColumns) =>
          prevColumns.map((col) => ({
            ...col,
            items: tasks.filter((task: Task) => task.status === col.id),
          }))
        );
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  function handleDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === "Task";
    if (!isActiveATask) return;

    setColumns((columns) => {
      const activeColumn = columns.find((col) =>
        col.items.some((task) => task.id === activeId)
      );
      const overColumn = columns.find((col) =>
        col.items.some((task) => task.id === overId) || col.id === overId
      );

      if (!activeColumn || !overColumn) {
        return columns;
      }
      
      const activeIndex = activeColumn.items.findIndex((t) => t.id === activeId);
      const overIndex = overColumn.items.findIndex((t) => t.id === overId);


      if (activeColumn.id === overColumn.id) {
        // move task in the same column
        return columns.map((col) => {
          if (col.id === activeColumn.id) {
            col.items = arrayMove(col.items, activeIndex, overIndex);
          }
          return col;
        });
      } else {
        // move task to a different column
        let newColumns = [...columns];
        const [movedTask] = activeColumn.items.splice(activeIndex, 1);
        movedTask.status = overColumn.id as "To Do" | "In Progress" | "Done";

        // Find the correct new index in the destination column
        const newOverIndex = over.data.current?.type === "Task" ? overIndex : overColumn.items.length;
        overColumn.items.splice(newOverIndex, 0, movedTask);
        
        return newColumns;
      }
    });

    setActiveTask(null);
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="flex flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl text-gray-50">
              Projects Kanban
            </h1>
          </div>
          {loading ? (
            <div className="flex gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-full p-4 bg-gray-900/40 rounded-xl">
                  <Skeleton className="h-6 w-1/3 mb-4" />
                  <Skeleton className="h-[100px] w-full mb-2" />
                  <Skeleton className="h-[100px] w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
             <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm p-4 text-red-500">
              <p>Error: {error}</p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <div className="flex gap-4">
                <SortableContext items={columns.map((c) => c.id)}>
                  {columns.map((col) => (
                    <KanbanColumn key={col.id} column={col} />
                  ))}
                </SortableContext>
              </div>
              <DragOverlay>
                {activeTask && <TaskCard task={activeTask} />}
              </DragOverlay>
            </DndContext>
          )}
        </main>
      </div>
    </div>
  );
}

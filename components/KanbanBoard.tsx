"use client";

import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";
import { KanbanColumnSkeleton } from "./Skeletons";
import type { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import type { Doc } from "@/convex/_generated/dataModel";

const COLUMNS: { id: string; title: string; status: Doc<"tasks">["status"] }[] = [
  { id: "inbox", title: "INBOX", status: "inbox" },
  { id: "assigned", title: "ASSIGNED", status: "assigned" },
  { id: "in_progress", title: "IN PROGRESS", status: "in_progress" },
  { id: "review", title: "REVIEW", status: "review" },
  { id: "done", title: "DONE", status: "done" },
];

interface KanbanBoardProps {
  onTaskClick: (taskId: Id<"tasks">) => void;
  selectedTaskId: Id<"tasks"> | null;
}

export function KanbanBoard({ onTaskClick }: KanbanBoardProps) {
  const tasks = useQuery(api.tasks.getAll);
  const agents = useQuery(api.agents.getAll);
  const updateStatus = useMutation(api.tasks.updateStatus);
  const [activeId, setActiveId] = useState<Id<"tasks"> | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as Id<"tasks">);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    const taskId = active.id as Id<"tasks">;
    let columnId = over.id as string;
    const colByColId = COLUMNS.find((c) => c.id === columnId);
    if (!colByColId) {
      const droppedOnTask = tasks?.find((t) => t._id === columnId);
      if (droppedOnTask) {
        columnId = droppedOnTask.status;
      }
    }
    const col = COLUMNS.find((c) => c.id === columnId);
    if (col && col.status !== tasks?.find((t) => t._id === taskId)?.status) {
      updateStatus({ id: taskId, status: col.status });
    }
  };

  const activeTask = activeId && tasks?.find((t) => t._id === activeId);

  if (!tasks) {
    return (
      <div className="theme-bg-primary flex h-full flex-col overflow-hidden p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="h-6 w-40 animate-pulse rounded theme-bg-tertiary" />
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <KanbanColumnSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="theme-bg-primary flex h-full flex-col overflow-hidden p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="theme-text-primary text-lg font-semibold">MISSION QUEUE</h2>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              status={col.status}
              tasks={tasks.filter((t) => t.status === col.status)}
              agents={agents}
              onTaskClick={onTaskClick}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="w-[260px] cursor-grabbing">
              <TaskCard
                task={activeTask}
                agents={agents}
                onClick={() => {}}
                isDragging
                disableDrag
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

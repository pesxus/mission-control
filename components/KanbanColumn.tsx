"use client";

import { useDroppable } from "@dnd-kit/core";
import { TaskCard } from "./TaskCard";
import type { Doc } from "@/convex/_generated/dataModel";
import type { Id } from "@/convex/_generated/dataModel";

interface KanbanColumnProps {
  id: string;
  title: string;
  status: Doc<"tasks">["status"];
  tasks: Doc<"tasks">[];
  agents: Doc<"agents">[] | undefined;
  onTaskClick: (taskId: Id<"tasks">) => void;
}

export function KanbanColumn({
  id,
  title,
  tasks,
  agents,
  onTaskClick,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex w-[280px] shrink-0 flex-col rounded-lg border bg-stone-50/80 transition-colors ${
        isOver ? "border-amber-400 bg-amber-50/50" : "border-stone-200"
      }`}
    >
      <div className="border-b border-stone-200 px-4 py-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-600">
          {title}
        </h3>
        <span className="mt-1 block text-lg font-bold text-stone-900">
          {tasks.length}
        </span>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            agents={agents}
            onClick={() => onTaskClick(task._id)}
          />
        ))}
      </div>
    </div>
  );
}

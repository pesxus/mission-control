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
      className={`flex w-[280px] shrink-0 flex-col rounded-lg border transition-colors ${
        isOver
          ? "border-amber-400 bg-amber-50/50 dark:border-amber-500 dark:bg-amber-900/20 midnight:border-violet-400 midnight:bg-violet-900/20"
          : "theme-border theme-bg-tertiary"
      }`}
    >
      <div className="theme-border border-b px-4 py-3">
        <h3 className="theme-text-secondary text-xs font-semibold uppercase tracking-wider">
          {title}
        </h3>
        <span className="theme-text-primary mt-1 block text-lg font-bold">
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

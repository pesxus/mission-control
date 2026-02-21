"use client";

import { useDraggable } from "@dnd-kit/core";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Doc } from "@/convex/_generated/dataModel";
import type { Id } from "@/convex/_generated/dataModel";
import { AgentAvatar } from "./AgentAvatar";

interface TaskCardProps {
  task: Doc<"tasks">;
  agents: Doc<"agents">[] | undefined;
  onClick: () => void;
  isDragging?: boolean;
  disableDrag?: boolean;
}

export function TaskCard({ task, agents, onClick, isDragging, disableDrag }: TaskCardProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: task._id,
    data: { task },
    disabled: disableDrag,
  });

  const assignees = (task.assigneeIds ?? [])
    .map((id) => agents?.find((a) => a._id === id))
    .filter(Boolean) as Doc<"agents">[];
  const tags = task.tags ?? [];
  const timeAgo = formatDistanceToNow(task.updatedAt, {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <article
      ref={setNodeRef}
      {...(disableDrag ? {} : { ...attributes, ...listeners })}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`rounded-lg border border-stone-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md ${
        disableDrag ? "cursor-default" : "cursor-grab active:cursor-grabbing"
      } ${isDragging ? "opacity-50 shadow-lg" : ""}`}
    >
      <h3 className="text-sm font-medium text-stone-900 line-clamp-1">
        {task.title}
      </h3>
      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs text-stone-500">
          {task.description}
        </p>
      )}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          {assignees.slice(0, 3).map((a) => (
            <AgentAvatar key={a._id} name={a.name} size="sm" />
          ))}
          {assignees.length > 3 && (
            <span className="text-[10px] text-stone-400">+{assignees.length - 3}</span>
          )}
        </div>
        <span className="text-[10px] text-stone-400">{timeAgo}</span>
      </div>
      {tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {tags.slice(0, 5).map((tag) => (
            <span
              key={tag}
              className="rounded bg-stone-100 px-1.5 py-0.5 text-[10px] text-stone-600"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

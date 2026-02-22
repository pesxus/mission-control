"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { ActivityItemSkeleton } from "./Skeletons";

const ACTIVITY_TYPES = [
  { id: "all", label: "All" },
  { id: "task_created", label: "Tasks" },
  { id: "message_sent", label: "Comments" },
  { id: "decision", label: "Decisions" },
  { id: "document_created", label: "Docs" },
  { id: "task_updated", label: "Status" },
] as const;

function formatActivityMessage(
  type: string,
  message: string,
  agentName: string,
  taskTitle?: string
): string {
  switch (type) {
    case "message_sent":
      return `${agentName} commented on "${taskTitle ?? "task"}"`;
    case "task_created":
      return `${agentName} created task "${taskTitle ?? "task"}"`;
    case "task_updated":
      return taskTitle
        ? `${agentName} updated "${taskTitle}"`
        : `${agentName} updated task status`;
    case "document_created":
      return `${agentName} created document`;
    case "agent_status_changed":
      return `${agentName} changed status`;
    case "decision":
      return `${agentName} made a decision`;
    default:
      return message;
  }
}

interface LiveFeedProps {
  onTaskClick: (taskId: Id<"tasks">) => void;
}

export function LiveFeed({ onTaskClick }: LiveFeedProps) {
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [agentFilter, setAgentFilter] = useState<Id<"agents"> | undefined>(
    undefined
  );
  
  // Debounce filters to reduce API calls
  const debouncedTypeFilter = useDebouncedValue(typeFilter, 300);
  const debouncedAgentFilter = useDebouncedValue(agentFilter, 300);
  
  const activities = useQuery(api.activities.getRecent, {
    limit: 50,
    type: debouncedTypeFilter === "all" ? undefined : debouncedTypeFilter,
    agentId: debouncedAgentFilter,
  });
  const agents = useQuery(api.agents.getAll);
  const tasks = useQuery(api.tasks.getAll);

  const agentMap = new Map(agents?.map((a) => [a._id, a]) ?? []);
  const taskMap = new Map(tasks?.map((t) => [t._id, t]) ?? []);

  return (
    <aside className="theme-bg-tertiary theme-border flex w-[320px] shrink-0 flex-col border-l transition-colors">
      <div className="theme-border border-b p-4">
        <h2 className="theme-text-secondary mb-4 text-xs font-semibold uppercase tracking-wider">
          LIVE FEED
        </h2>
        <div className="mb-3 flex flex-wrap gap-1">
          {ACTIVITY_TYPES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTypeFilter(t.id === "all" ? undefined : t.id)}
              className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                (typeFilter === undefined && t.id === "all") ||
                typeFilter === t.id
                  ? "bg-stone-900 text-white dark:bg-slate-200 dark:text-slate-900 midnight:bg-violet-400 midnight:text-slate-950"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 midnight:bg-slate-700 midnight:text-slate-200 midnight:hover:bg-slate-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="theme-text-secondary text-xs">All Agents</span>
          {agents?.slice(0, 10).map((a) => (
            <button
              key={a._id}
              onClick={() =>
                setAgentFilter(agentFilter === a._id ? undefined : a._id)
              }
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold transition-all ${
                agentFilter === a._id
                  ? "ring-2 ring-stone-900 ring-offset-2 bg-stone-200 text-stone-900 dark:ring-slate-200 dark:ring-offset-slate-900 dark:bg-slate-700 dark:text-slate-50 midnight:ring-violet-300 midnight:ring-offset-slate-900 midnight:bg-slate-700 midnight:text-slate-50"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 midnight:bg-slate-700 midnight:text-slate-200 midnight:hover:bg-slate-600"
              }`}
              title={a.name}
            >
              {a.name.charAt(0)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {!activities ? (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <ActivityItemSkeleton key={i} />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <p className="theme-text-tertiary text-sm">No activity yet</p>
        ) : (
          <ul className="space-y-3">
            {activities.map((activity) => {
              const agent = agentMap.get(activity.agentId);
              const task = activity.taskId
                ? taskMap.get(activity.taskId)
                : undefined;
              const text = formatActivityMessage(
                activity.type,
                activity.message,
                agent?.name ?? "Unknown",
                task?.title
              );
              return (
                <li key={activity._id} className="text-sm">
                  <button
                    onClick={() =>
                      activity.taskId && onTaskClick(activity.taskId)
                    }
                    className={`text-left transition-colors ${
                      activity.taskId
                        ? "cursor-pointer theme-text-secondary hover:theme-text-primary"
                        : "cursor-default theme-text-tertiary"
                    }`}
                  >
                    {text}
                  </button>
                  <p className="theme-text-tertiary mt-0.5 text-xs">
                    {formatDistanceToNow(activity.createdAt, {
                      addSuffix: true,
                      locale: ptBR,
                    })}
                  </p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}

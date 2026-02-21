"use client";

import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import type { Id } from "@/convex/_generated/dataModel";

const STATUS_OPTIONS = [
  { value: "inbox", label: "Inbox" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
] as const;

export default function TaskDetailPage() {
  const params = useParams();
  const taskId = params.id as Id<"tasks">;

  const task = useQuery(api.tasks.getById, { id: taskId });
  const agents = useQuery(api.agents.getAll);
  const updateStatus = useMutation(api.tasks.updateStatus);

  const [localStatus, setLocalStatus] = useState<string>("");
  
  // Use task status directly if local state not set
  const currentStatus = localStatus || task?.status || "";

  const handleStatusChange = async (newStatus: string) => {
    setLocalStatus(newStatus);
    await updateStatus({
      id: taskId,
      status: newStatus as (typeof STATUS_OPTIONS)[number]["value"],
    });
  };

  const agentMap = new Map(agents?.map((a) => [a._id, a]) ?? []);

  if (!task) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100">
        <p className="text-stone-500">Loading task...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="mx-auto max-w-3xl p-8">
        <div className="mb-6 flex items-center gap-4">
          <Link
            href="/"
            className="text-stone-500 transition-colors hover:text-stone-900"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-stone-900">{task.title}</h1>
        </div>

        <div className="mb-8 overflow-hidden rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-stone-900">
            {task.title}
          </h2>
          <p className="mb-6 text-stone-500">{task.description}</p>

          <div className="mb-4 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-stone-600">
                Status:
              </label>
              <select
                value={currentStatus}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="rounded-lg border border-stone-200 px-3 py-2 text-sm"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <span className="text-sm text-stone-500">
              Created: {new Date(task.createdAt).toLocaleString()}
            </span>
          </div>

          {(task.assigneeIds ?? []).length > 0 && (
            <div className="mb-4">
              <span className="text-sm font-medium text-stone-600">
                Assignees:{" "}
              </span>
              <span className="text-sm text-stone-600">
                {(task.assigneeIds ?? [])
                  .map((id) => agentMap.get(id)?.name)
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          )}

          <div className="flex gap-3">
            <Link
              href={`/tasks/${task._id}/chat`}
              className="rounded-lg bg-stone-900 px-6 py-3 text-sm font-medium text-white hover:bg-stone-800"
            >
              Open Chat
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-stone-200 px-6 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

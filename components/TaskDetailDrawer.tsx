"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import Link from "next/link";

interface TaskDetailDrawerProps {
  taskId: Id<"tasks"> | null;
  onClose: () => void;
}

const STATUS_OPTIONS = [
  { value: "inbox", label: "Inbox" },
  { value: "assigned", label: "Assigned" },
  { value: "in_progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
] as const;

export function TaskDetailDrawer({ taskId, onClose }: TaskDetailDrawerProps) {
  const task = useQuery(
    api.tasks.getById,
    taskId ? { id: taskId } : "skip"
  );
  const agents = useQuery(api.agents.getAll);
  const messages = useQuery(
    api.messages.get,
    taskId ? { taskId } : "skip"
  );
  const updateStatus = useMutation(api.tasks.updateStatus);
  const sendMessage = useMutation(api.messages.create);
  const [messageContent, setMessageContent] = useState("");
  const [localStatus, setLocalStatus] = useState<string>("");
  
  // Set local status when task changes - use initial value pattern
  const taskStatus = task?.status ?? "";
  const [selectedAgentId, setSelectedAgentId] = useState<Id<"agents"> | null>(
    null
  );
  
  // Set first agent as default when agents load
  const defaultAgentId = agents?.[0]?._id ?? null;

  if (!taskId) return null;

  // Use task status directly if local state not set
  const currentStatus = localStatus || taskStatus;
  const currentAgentId = selectedAgentId || defaultAgentId;

  const handleStatusChange = async (newStatus: string) => {
    setLocalStatus(newStatus);
    await updateStatus({
      id: taskId,
      status: newStatus as (typeof STATUS_OPTIONS)[number]["value"],
    });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageContent.trim() || !currentAgentId) return;
    await sendMessage({
      taskId,
      fromAgentId: currentAgentId,
      content: messageContent.trim(),
    });
    setMessageContent("");
  };

  const agentMap = new Map(agents?.map((a) => [a._id, a]) ?? []);

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
        aria-hidden
      />
      <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-stone-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-stone-200 p-4">
          <h2 className="text-lg font-semibold text-stone-900">
            {task?.title ?? "Task Details"}
          </h2>
          <button
            onClick={onClose}
            className="rounded p-2 text-stone-500 hover:bg-stone-100 hover:text-stone-900"
            aria-label="Close"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {!task ? (
          <div className="flex flex-1 items-center justify-center p-8">
            <p className="text-stone-500">Loading...</p>
          </div>
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="space-y-4 overflow-y-auto p-4">
              <div>
                <label className="block text-xs font-medium text-stone-500">
                  Status
                </label>
                <select
                  value={currentStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-500">
                  Description
                </label>
                <p className="mt-1 text-sm text-stone-700">
                  {task.description || "No description"}
                </p>
              </div>

              {task.tags && task.tags.length > 0 && (
                <div>
                  <label className="block text-xs font-medium text-stone-500">
                    Tags
                  </label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {task.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-stone-100 px-2 py-0.5 text-xs text-stone-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-500">
                  Assignees
                </label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {(task.assigneeIds ?? []).map((id) => {
                    const a = agentMap.get(id);
                    return a ? (
                      <span
                        key={id}
                        className="rounded-full bg-stone-100 px-2 py-1 text-xs font-medium text-stone-700"
                      >
                        {a.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>

              <div className="border-t border-stone-200 pt-4">
                <h3 className="mb-3 text-sm font-semibold text-stone-800">
                  Comments
                </h3>
                <div className="space-y-3">
                  {messages?.map((msg) => {
                    const agent = agentMap.get(msg.fromAgentId);
                    return (
                      <div
                        key={msg._id}
                        className="rounded-lg bg-stone-50 p-3"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-stone-700">
                            {agent?.name ?? "Unknown"}
                          </span>
                          <span className="text-xs text-stone-400">
                            {new Date(msg.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-stone-600">
                          {msg.content}
                        </p>
                      </div>
                    );
                  })}
                  {(!messages || messages.length === 0) && (
                    <p className="text-sm text-stone-400">
                      No comments yet. Start the conversation!
                    </p>
                  )}
                </div>

                <form onSubmit={handleSendMessage} className="mt-4">
                  <div className="mb-2">
                    <label className="block text-xs font-medium text-stone-500">
                      Post as
                    </label>
                    <select
                      value={currentAgentId ?? ""}
                      onChange={(e) =>
                        setSelectedAgentId(e.target.value as Id<"agents">)
                      }
                      className="mt-1 w-full rounded border border-stone-200 px-2 py-1.5 text-sm"
                    >
                      {agents?.map((a) => (
                        <option key={a._id} value={a._id}>
                          {a.name} ({a.role})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      placeholder="Type a comment..."
                      className="flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <button
                      type="submit"
                      disabled={!messageContent.trim()}
                      className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="border-t border-stone-200 p-4">
              <Link
                href={`/tasks/${taskId}/chat`}
                className="text-sm font-medium text-amber-600 hover:text-amber-700"
              >
                Open full chat →
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

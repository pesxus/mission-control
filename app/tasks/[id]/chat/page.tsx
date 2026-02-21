"use client";

import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import type { Id } from "@/convex/_generated/dataModel";

export default function TaskChatPage() {
  const params = useParams();
  const taskId = params.id as Id<"tasks">;

  const task = useQuery(api.tasks.getById, { id: taskId });
  const messages = useQuery(api.messages.get, { taskId });
  const agents = useQuery(api.agents.getAll);
  const sendMessage = useMutation(api.messages.create);

  const [content, setContent] = useState("");
  const [selectedAgentId, setSelectedAgentId] = useState<Id<"agents"> | null>(null);
  
  // Use first agent as default
  const defaultAgentId = agents?.[0]?._id ?? null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentAgentId = selectedAgentId || defaultAgentId;
    if (!content.trim() || !currentAgentId) return;
    await sendMessage({
      taskId,
      fromAgentId: currentAgentId,
      content: content.trim(),
    });
    setContent("");
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
          <h1 className="text-2xl font-bold text-stone-900">
            Chat - {task.title}
          </h1>
        </div>

        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm">
          <div className="border-b border-stone-200 px-6 py-4">
            <div className="flex items-center gap-4">
              <span
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  task.status === "inbox"
                    ? "bg-amber-100 text-amber-800"
                    : task.status === "assigned"
                    ? "bg-blue-100 text-blue-800"
                    : task.status === "in_progress"
                    ? "bg-green-100 text-green-800"
                    : task.status === "review"
                    ? "bg-violet-100 text-violet-800"
                    : "bg-stone-100 text-stone-800"
                }`}
              >
                {task.status}
              </span>
              <span className="text-sm text-stone-500">
                {new Date(task.createdAt).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-stone-800">Messages</h2>
            <div className="mb-6 space-y-4">
              {messages?.map((message) => {
                const agent = agentMap.get(message.fromAgentId);
                return (
                  <div
                    key={message._id}
                    className="rounded-lg bg-stone-50 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-200 text-sm font-semibold text-stone-700">
                        {agent?.name?.charAt(0) ?? "?"}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-stone-700">
                          {agent?.name ?? "Unknown"}
                        </div>
                        <div className="text-stone-600">{message.content}</div>
                        <div className="mt-1 text-xs text-stone-400">
                          {new Date(message.createdAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {(!messages || messages.length === 0) && (
                <p className="text-center text-stone-500">
                  No messages yet. Start the conversation!
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-500">
                  Post as
                </label>
                <select
                  value={(selectedAgentId || defaultAgentId) ?? ""}
                  onChange={(e) =>
                    setSelectedAgentId(e.target.value as Id<"agents">)
                  }
                  className="mt-1 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
                >
                  {agents?.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.name} ({a.role})
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-lg border border-stone-200 px-4 py-3 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  disabled={!content.trim()}
                  className="rounded-lg bg-stone-900 px-6 py-3 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

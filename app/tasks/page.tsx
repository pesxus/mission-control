"use client";

import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import Link from "next/link";

export default function TasksPage() {
  const tasks = useQuery(api.tasks.getAll);

  if (!tasks) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-100">
        <p className="text-stone-500">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-100">
      <div className="mx-auto max-w-4xl p-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-stone-900">Mission Control - Tasks</h1>
          <Link
            href="/"
            className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
          >
            Dashboard
          </Link>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <Link
              key={task._id}
              href={`/tasks/${task._id}`}
              className="block rounded-lg border border-stone-200 bg-white p-6 transition-colors hover:border-stone-300 hover:shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold mb-2">
                    {task.title}
                  </h2>
                  <p className="mb-4 text-stone-500">{task.description}</p>

                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
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
                      Created: {new Date(task.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-stone-500">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="mt-12 text-center text-stone-500">
            <p>No tasks yet. Create one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
}

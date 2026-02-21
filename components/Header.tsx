"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import Link from "next/link";
import { CreateTaskModal } from "./CreateTaskModal";

export function Header() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const agents = useQuery(api.agents.getAll);
  const tasks = useQuery(api.tasks.getAll);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("en-US", { hour12: false }));
      setDate(now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }).toUpperCase());
    };
    updateClock();
    const id = setInterval(updateClock, 60000); // Update every minute instead of every second
    return () => clearInterval(id);
  }, []);

  const activeAgents = agents?.filter((a) => a.status === "active").length ?? 0;
  const tasksInQueue = tasks?.filter((t) => t.status !== "done").length ?? 0;

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-stone-900">
            MISSION CONTROL
          </span>
          <span className="rounded bg-stone-200 px-2 py-0.5 text-xs font-medium text-stone-600">
            SiteGPT
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-8">
        <button
          onClick={() => setShowCreateModal(true)}
          className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
        >
          Create Task
        </button>
        <div className="flex gap-6 text-sm">
          <span className="font-medium text-stone-700">
            {activeAgents} AGENTS ACTIVE
          </span>
          <span className="font-medium text-stone-700">
            {tasksInQueue} TASKS IN QUEUE
          </span>
        </div>

        <Link
          href="/tasks"
          className="text-sm font-medium text-stone-600 hover:text-stone-900"
        >
          Tasks List
        </Link>

        <div className="flex items-center gap-4 text-sm text-stone-500">
          <span className="font-mono">{time}</span>
          <span>{date}</span>
          <span className="flex items-center gap-1.5 text-green-600">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            ONLINE
          </span>
        </div>
      </div>
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </header>
  );
}

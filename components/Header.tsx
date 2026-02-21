"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect } from "react";
import Link from "next/link";
import { CreateTaskModal } from "./CreateTaskModal";
import { ThemeToggle } from "./ThemeToggle";

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
      setDate(
        now
          .toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })
          .toUpperCase()
      );
    };
    updateClock();
    const id = setInterval(updateClock, 60000);
    return () => clearInterval(id);
  }, []);

  const activeAgents = agents?.filter((a) => a.status === "active").length ?? 0;
  const tasksInQueue = tasks?.filter((t) => t.status !== "done").length ?? 0;

  return (
    <header className="theme-bg-secondary theme-border flex items-center justify-between border-b px-6 py-4 backdrop-blur transition-colors">
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Link href="/" className="flex items-center gap-2">
          <span className="theme-text-primary text-xl font-bold tracking-tight">
            MISSION CONTROL
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-8">
        <button
          onClick={() => setShowCreateModal(true)}
          className="rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 dark:bg-stone-700 dark:hover:bg-stone-600 midnight:bg-slate-700 midnight:hover:bg-slate-600"
        >
          Create Task
        </button>
        <div className="flex gap-6 text-sm">
          <span className="theme-text-secondary font-medium">
            {activeAgents} AGENTS ACTIVE
          </span>
          <span className="theme-text-secondary font-medium">
            {tasksInQueue} TASKS IN QUEUE
          </span>
        </div>

        <Link
          href="/tasks"
          className="theme-text-secondary text-sm font-medium hover:theme-text-primary transition-colors"
        >
          Tasks List
        </Link>

        <div className="theme-text-tertiary flex items-center gap-4 text-sm">
          <span className="font-mono">{time}</span>
          <span>{date}</span>
          <span className="theme-success flex items-center gap-1.5">
            <span className="theme-success-bg h-2 w-2 rounded-full" />
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

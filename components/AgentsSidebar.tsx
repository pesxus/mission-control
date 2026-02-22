"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AgentAvatar } from "./AgentAvatar";

export function AgentsSidebar() {
  const agents = useQuery(api.agents.getAll);
  const seedAgents = useMutation(api.agents.seed);

  if (!agents) {
    return (
      <aside className="theme-bg-tertiary theme-border w-[280px] shrink-0 border-r p-4 transition-colors">
        <h2 className="theme-text-secondary mb-4 text-xs font-semibold uppercase tracking-wider">
          AGENTS
        </h2>
        <p className="theme-text-tertiary text-sm">Loading...</p>
      </aside>
    );
  }

  if (agents.length === 0) {
    return (
      <aside className="theme-bg-tertiary theme-border w-[280px] shrink-0 overflow-y-auto border-r p-4 transition-colors">
        <h2 className="theme-text-secondary mb-4 text-xs font-semibold uppercase tracking-wider">
          AGENTS
        </h2>
        <p className="theme-text-secondary mb-4 text-sm">
          No agents yet. Seed the squad to get started.
        </p>
        <button
          onClick={() => seedAgents()}
          className="w-full rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-slate-100 midnight:bg-violet-400 midnight:text-slate-950 midnight:hover:bg-violet-300"
        >
          Seed Agents
        </button>
      </aside>
    );
  }

  return (
    <aside className="theme-bg-tertiary theme-border w-[280px] shrink-0 overflow-y-auto border-r p-4 transition-colors">
      <h2 className="theme-text-secondary mb-4 text-xs font-semibold uppercase tracking-wider">
        AGENTS ({agents.length})
      </h2>
      <ul className="space-y-2">
        {agents.map((agent) => (
          <li
            key={agent._id}
            className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-stone-100/80 dark:hover:bg-slate-700/60 midnight:hover:bg-slate-700/60"
          >
            <AgentAvatar name={agent.name} size="md" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="theme-text-primary truncate text-sm font-medium">
                  {agent.name}
                </span>
                {agent.status === "active" && (
                  <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium bg-green-100 text-green-700 dark:bg-emerald-400/20 dark:text-emerald-200 midnight:bg-emerald-400/20 midnight:text-emerald-200">
                    WORKING
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="theme-text-secondary truncate text-xs">
                  {agent.role}
                </span>
                {agent.level && (
                  <span className="shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase bg-stone-200 text-stone-600 dark:bg-slate-700 dark:text-slate-200 midnight:bg-slate-700 midnight:text-slate-200">
                    {agent.level}
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}

"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AgentAvatar } from "./AgentAvatar";

export function AgentsSidebar() {
  const agents = useQuery(api.agents.getAll);
  const seedAgents = useMutation(api.agents.seed);

  if (!agents) {
    return (
      <aside className="w-[280px] shrink-0 border-r border-stone-200 bg-stone-50/50 p-4">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
          AGENTS
        </h2>
        <p className="text-sm text-stone-400">Loading...</p>
      </aside>
    );
  }

  if (agents.length === 0) {
    return (
      <aside className="w-[280px] shrink-0 overflow-y-auto border-r border-stone-200 bg-stone-50/50 p-4">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
          AGENTS
        </h2>
        <p className="mb-4 text-sm text-stone-500">
          No agents yet. Seed the squad to get started.
        </p>
        <button
          onClick={() => seedAgents()}
          className="w-full rounded-lg bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
        >
          Seed Agents
        </button>
      </aside>
    );
  }

  return (
    <aside className="w-[280px] shrink-0 overflow-y-auto border-r border-stone-200 bg-stone-50/50 p-4">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-stone-500">
        AGENTS ({agents.length})
      </h2>
      <ul className="space-y-2">
        {agents.map((agent) => (
          <li
            key={agent._id}
            className="flex items-center gap-3 rounded-lg p-2 hover:bg-stone-100/80"
          >
            <AgentAvatar name={agent.name} size="md" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-medium text-stone-900">
                  {agent.name}
                </span>
                {agent.status === "active" && (
                  <span className="shrink-0 rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
                    WORKING
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="truncate text-xs text-stone-500">
                  {agent.role}
                </span>
                {agent.level && (
                  <span className="shrink-0 rounded bg-stone-200 px-1.5 py-0.5 text-[10px] font-medium uppercase text-stone-600">
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

"use client";

import { Header } from "@/components/Header";
import { AgentsSidebar } from "@/components/AgentsSidebar";
import { KanbanBoard } from "@/components/KanbanBoard";
import { LiveFeed } from "@/components/LiveFeed";
import { TaskDetailDrawer } from "@/components/TaskDetailDrawer";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";

export default function DashboardPage() {
  const [selectedTaskId, setSelectedTaskId] = useState<Id<"tasks"> | null>(null);

  return (
    <div className="flex h-screen flex-col bg-stone-100">
      <Header />
      <div className="flex flex-1 min-h-0">
        <AgentsSidebar />
        <main className="flex-1 overflow-hidden">
          <KanbanBoard
            onTaskClick={(id) => setSelectedTaskId(id)}
            selectedTaskId={selectedTaskId}
          />
        </main>
        <LiveFeed onTaskClick={(id) => setSelectedTaskId(id)} />
      </div>
      <TaskDetailDrawer
        taskId={selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
      />
    </div>
  );
}

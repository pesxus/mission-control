import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { TaskCard } from "@/components/TaskCard";
import type { Doc } from "@/convex/_generated/dataModel";

describe("TaskCard", () => {
  const mockTask: Doc<"tasks"> = {
    _id: "task-1" as any,
    title: "Test Task",
    description: "This is a test task description",
    status: "inbox",
    assigneeIds: [],
    tags: ["test", "example"],
    createdAt: Date.now() - 3600000, // 1 hour ago
    updatedAt: Date.now() - 1800000, // 30 minutes ago
    createdBy: "agent-1" as any,
  };

  const mockAgents: Doc<"agents">[] = [
    {
      _id: "agent-1" as any,
      name: "Jarvis",
      role: "Squad Lead",
      level: "lead",
      status: "active",
      sessionKey: "agent:main:main",
    },
    {
      _id: "agent-2" as any,
      name: "Friday",
      role: "Developer",
      level: "int",
      status: "idle",
      sessionKey: "agent:developer:main",
    },
  ];

  it("should render task title", () => {
    render(
      <TaskCard
        task={mockTask}
        agents={mockAgents}
        onClick={() => {}}
      />
    );
    
    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });

  it("should render task description", () => {
    render(
      <TaskCard
        task={mockTask}
        agents={mockAgents}
        onClick={() => {}}
      />
    );
    
    expect(screen.getByText("This is a test task description")).toBeInTheDocument();
  });

  it("should render tags when present", () => {
    render(
      <TaskCard
        task={mockTask}
        agents={mockAgents}
        onClick={() => {}}
      />
    );
    
    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByText("example")).toBeInTheDocument();
  });

  it("should not render assignee avatars when no assignees", () => {
    render(
      <TaskCard
        task={mockTask}
        agents={mockAgents}
        onClick={() => {}}
      />
    );
    
    // Should not find any avatar elements
    const avatars = screen.queryAllByRole("img");
    expect(avatars).toHaveLength(0);
  });

  it("should render assignee avatars when assignees present", () => {
    const taskWithAssignees = {
      ...mockTask,
      assigneeIds: ["agent-1" as any, "agent-2" as any],
    };

    render(
      <TaskCard
        task={taskWithAssignees}
        agents={mockAgents}
        onClick={() => {}}
      />
    );
    
    // Should find avatar elements
    expect(screen.getByText("Jarvis")).toBeDefined();
    expect(screen.getByText("Friday")).toBeDefined();
  });

  it("should call onClick when clicked", () => {
    let clicked = false;
    const handleClick = () => {
      clicked = true;
    };

    render(
      <TaskCard
        task={mockTask}
        agents={mockAgents}
        onClick={handleClick}
      />
    );
    
    screen.getByText("Test Task").click();
    expect(clicked).toBe(true);
  });
});

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Agents table
  agents: defineTable({
    name: v.string(),
    role: v.string(),
    level: v.optional(
      v.union(v.literal("lead"), v.literal("int"), v.literal("spc"))
    ),
    status: v.union(
      v.literal("idle"),
      v.literal("active"),
      v.literal("blocked")
    ),
    currentTaskId: v.optional(v.id("tasks")),
    sessionKey: v.string(),
  })
    .index("by_name", ["name"])
    .index("by_status", ["status"])
    .index("by_current_task", ["currentTaskId"]),

  // Tasks table
  tasks: defineTable({
    title: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("inbox"),
      v.literal("assigned"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done")
    ),
    assigneeIds: v.array(v.id("agents")),
    tags: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
    createdBy: v.id("agents"),
  })
    .index("by_status", ["status"])
    .index("by_assignees", ["assigneeIds"])
    .index("by_created_at", ["createdAt"])
    .index("by_assignee_and_status", ["assigneeIds", "status"]),

  // Messages table
  messages: defineTable({
    taskId: v.id("tasks"),
    fromAgentId: v.id("agents"),
    content: v.string(),
    attachments: v.array(v.id("documents")),
    createdAt: v.number(),
  })
    .index("by_task", ["taskId"])
    .index("by_created_at", ["createdAt"])
    .index("by_agent", ["fromAgentId"]),

  // Activities table
  activities: defineTable({
    type: v.union(
      v.literal("task_created"),
      v.literal("message_sent"),
      v.literal("document_created"),
      v.literal("task_updated"),
      v.literal("agent_status_changed"),
      v.literal("decision")
    ),
    agentId: v.id("agents"),
    taskId: v.optional(v.id("tasks")),
    message: v.string(),
    createdAt: v.number(),
  })
    .index("by_agent", ["agentId"])
    .index("by_created_at", ["createdAt"])
    .index("by_task", ["taskId"]),

  // Documents table
  documents: defineTable({
    title: v.string(),
    content: v.string(),
    type: v.union(
      v.literal("deliverable"),
      v.literal("research"),
      v.literal("protocol"),
      v.literal("bug_report"),
      v.literal("comparative_analysis")
    ),
    taskId: v.optional(v.id("tasks")),
    createdBy: v.id("agents"),
    createdAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_task", ["taskId"])
    .index("by_created_at", ["createdAt"]),

  // Notifications table
  notifications: defineTable({
    mentionedAgentId: v.id("agents"),
    content: v.string(),
    delivered: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_mentioned_agent", ["mentionedAgentId"])
    .index("by_delivered", ["delivered"]),
});

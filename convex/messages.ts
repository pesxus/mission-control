import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const MAX_MESSAGE_LENGTH = 10000;
const MAX_ATTACHMENTS = 10;

// Mutation to add a new message
export const create = mutation({
  args: {
    taskId: v.id("tasks"),
    fromAgentId: v.id("agents"),
    content: v.string(),
    attachments: v.optional(v.array(v.id("documents"))),
  },
  handler: async (ctx, args) => {
    // Validation
    if (args.content.trim().length === 0) {
      throw new Error("Message content cannot be empty");
    }
    if (args.content.length > MAX_MESSAGE_LENGTH) {
      throw new Error(`Message must be less than ${MAX_MESSAGE_LENGTH} characters`);
    }
    if (args.attachments && args.attachments.length > MAX_ATTACHMENTS) {
      throw new Error(`Cannot have more than ${MAX_ATTACHMENTS} attachments`);
    }

    // Verify task exists
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error(`Task ${args.taskId} not found`);
    }

    // Verify agent exists
    const agent = await ctx.db.get(args.fromAgentId);
    if (!agent) {
      throw new Error(`Agent ${args.fromAgentId} not found`);
    }

    const messageId = await ctx.db.insert("messages", {
      taskId: args.taskId,
      fromAgentId: args.fromAgentId,
      content: args.content.trim(),
      attachments: args.attachments || [],
      createdAt: Date.now(),
    });

    // Log activity
    await ctx.db.insert("activities", {
      type: "message_sent",
      agentId: args.fromAgentId,
      taskId: args.taskId,
      message: `New message in task "${task.title}"`,
      createdAt: Date.now(),
    });

    return messageId;
  },
});

// Query to get messages for a task
export const get = query({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .order("desc")
      .collect();

    return messages;
  },
});

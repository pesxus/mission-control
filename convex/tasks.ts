import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Validation constants
const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_ASSIGNEES = 10;
const MAX_TAGS = 10;

// Mutation to create a new task
export const create = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    createdBy: v.id("agents"),
    assigneeIds: v.array(v.id("agents")),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    // Validation
    if (args.title.trim().length === 0) {
      throw new Error("Task title cannot be empty");
    }
    if (args.title.length > MAX_TITLE_LENGTH) {
      throw new Error(`Task title must be less than ${MAX_TITLE_LENGTH} characters`);
    }
    if (args.description.length > MAX_DESCRIPTION_LENGTH) {
      throw new Error(`Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`);
    }
    if (args.assigneeIds.length > MAX_ASSIGNEES) {
      throw new Error(`Cannot assign more than ${MAX_ASSIGNEES} agents`);
    }
    if (args.tags && args.tags.length > MAX_TAGS) {
      throw new Error(`Cannot have more than ${MAX_TAGS} tags`);
    }

    // Verify creator exists
    const creator = await ctx.db.get(args.createdBy);
    if (!creator) {
      throw new Error(`Creator agent ${args.createdBy} not found`);
    }

    // Verify all assignees exist
    for (const agentId of args.assigneeIds) {
      const agent = await ctx.db.get(agentId);
      if (!agent) {
        throw new Error(`Agent ${agentId} not found`);
      }
    }

    const trimmedTitle = args.title.trim();
    const trimmedDescription = args.description.trim();
    const cleanedTags = args.tags?.map(t => t.trim()).filter(t => t.length > 0) ?? [];

    const taskId = await ctx.db.insert("tasks", {
      title: trimmedTitle,
      description: trimmedDescription,
      status: "inbox",
      assigneeIds: args.assigneeIds,
      tags: cleanedTags,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      createdBy: args.createdBy,
    });

    // Log activity
    await ctx.db.insert("activities", {
      type: "task_created",
      agentId: args.createdBy,
      taskId,
      message: `Task "${trimmedTitle}" created`,
      createdAt: Date.now(),
    });

    return taskId;
  },
});

// Mutation to update task status
export const updateStatus = mutation({
  args: {
    id: v.id("tasks"),
    status: v.union(
      v.literal("inbox"),
      v.literal("assigned"),
      v.literal("in_progress"),
      v.literal("review"),
      v.literal("done")
    ),
    assigneeIds: v.optional(v.array(v.id("agents"))),
  },
  handler: async (ctx, args) => {
    const task = await ctx.db.get(args.id);

    if (!task) {
      throw new Error("Task not found");
    }

    // Update task
    await ctx.db.patch(args.id, {
      status: args.status,
      assigneeIds: args.assigneeIds || task.assigneeIds,
      updatedAt: Date.now(),
    });

    // Log activity - CORREÇÃO 1: Usar task.createdBy ao invés de args.createdBy
    await ctx.db.insert("activities", {
      type: "task_updated",
      agentId: task.createdBy,
      taskId: args.id,
      message: `Task status changed to ${args.status}`,
      createdAt: Date.now(),
    });

    // Update currentTaskId for assignees
    if (args.assigneeIds) {
      for (const agentId of args.assigneeIds) {
        await ctx.db.patch(agentId, { currentTaskId: args.id });
      }
    }

    return { success: true };
  },
});

// Query to get tasks by agent
export const getByAssignee = query({
  args: {
    agentId: v.id("agents"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100;
    // Use pagination to avoid loading all tasks
    // Note: Convex doesn't support direct array index queries
    // Using take() with filter is more efficient than collect()
    const tasks = await ctx.db
      .query("tasks")
      .order("desc")
      .take(limit * 2); // Take more to account for filtering

    return tasks.filter(task => 
      task.assigneeIds.includes(args.agentId)
    ).slice(0, limit);
  },
});

// Query to get all tasks
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db
      .query("tasks")
      .order("desc")
      .collect();

    return tasks;
  },
});

// Query to get task by id
export const getById = query({
  args: {
    id: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

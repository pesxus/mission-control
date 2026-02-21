import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const MAX_TITLE_LENGTH = 200;
const MAX_CONTENT_LENGTH = 50000;

// Mutation to create a new document
export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    // Validation
    if (args.title.trim().length === 0) {
      throw new Error("Document title cannot be empty");
    }
    if (args.title.length > MAX_TITLE_LENGTH) {
      throw new Error(`Title must be less than ${MAX_TITLE_LENGTH} characters`);
    }
    if (args.content.length > MAX_CONTENT_LENGTH) {
      throw new Error(`Content must be less than ${MAX_CONTENT_LENGTH} characters`);
    }

    // Verify creator exists
    const creator = await ctx.db.get(args.createdBy);
    if (!creator) {
      throw new Error(`Creator agent ${args.createdBy} not found`);
    }

    // Verify task exists if provided
    if (args.taskId) {
      const task = await ctx.db.get(args.taskId);
      if (!task) {
        throw new Error(`Task ${args.taskId} not found`);
      }
    }

    const trimmedTitle = args.title.trim();
    const trimmedContent = args.content.trim();

    const documentId = await ctx.db.insert("documents", {
      title: trimmedTitle,
      content: trimmedContent,
      type: args.type,
      taskId: args.taskId,
      createdBy: args.createdBy,
      createdAt: Date.now(),
    });

    // Log activity
    await ctx.db.insert("activities", {
      type: "document_created",
      agentId: args.createdBy,
      taskId: args.taskId,
      message: `Document "${trimmedTitle}" (${args.type}) created`,
      createdAt: Date.now(),
    });

    return documentId;
  },
});

// Query to get documents by type
export const getByType = query({
  args: {
    type: v.union(
      v.literal("deliverable"),
      v.literal("research"),
      v.literal("protocol"),
      v.literal("bug_report"),
      v.literal("comparative_analysis")
    ),
  },
  handler: async (ctx, args) => {
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .order("desc")
      .collect();

    return documents;
  },
});

// Query to get documents by task
export const getByTask = query({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .order("desc")
      .collect();

    return documents;
  },
});

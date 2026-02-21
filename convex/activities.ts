import { query } from "./_generated/server";
import { v } from "convex/values";

// Query to get activities for a task
export const getByTask = query({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const activities = await ctx.db
      .query("activities")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .order("desc")
      .collect();

    return activities;
  },
});

// Query to get recent activities for Live Feed
export const getRecent = query({
  args: {
    limit: v.optional(v.number()),
    type: v.optional(v.string()),
    agentId: v.optional(v.id("agents")),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    const takeLimit = args.type ? limit * 3 : limit;
    const baseQuery = args.agentId
      ? ctx.db
          .query("activities")
          .withIndex("by_agent", (q) => q.eq("agentId", args.agentId!))
          .order("desc")
      : ctx.db
          .query("activities")
          .withIndex("by_created_at")
          .order("desc");
    const all = await baseQuery.take(takeLimit);
    const filtered = args.type
      ? all.filter((a) => a.type === args.type)
      : all;
    return filtered.slice(0, limit);
  },
});

// Query to get activities by agent
export const getByAgent = query({
  args: {
    agentId: v.id("agents"),
  },
  handler: async (ctx, args) => {
    const activities = await ctx.db
      .query("activities")
      .withIndex("by_agent", (q) => q.eq("agentId", args.agentId))
      .order("desc")
      .collect();

    return activities;
  },
});

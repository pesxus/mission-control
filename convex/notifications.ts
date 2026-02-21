import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const MAX_NOTIFICATION_CONTENT = 1000;

export const create = mutation({
  args: {
    mentionedAgentId: v.id("agents"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Validation
    if (args.content.trim().length === 0) {
      throw new Error("Notification content cannot be empty");
    }
    if (args.content.length > MAX_NOTIFICATION_CONTENT) {
      throw new Error(`Notification must be less than ${MAX_NOTIFICATION_CONTENT} characters`);
    }

    // Verify agent exists
    const agent = await ctx.db.get(args.mentionedAgentId);
    if (!agent) {
      throw new Error(`Agent ${args.mentionedAgentId} not found`);
    }

    return await ctx.db.insert("notifications", {
      mentionedAgentId: args.mentionedAgentId,
      content: args.content.trim(),
      delivered: false,
      createdAt: Date.now(),
    });
  },
});

export const getUndelivered = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_delivered", (q) => q.eq("delivered", false))
      .collect();
  },
});

export const markDelivered = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { delivered: true });
    return { success: true };
  },
});

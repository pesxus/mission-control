import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const SQUAD = [
  { name: "Jarvis", role: "Squad Lead", level: "lead" as const, sessionKey: "agent:main:main" },
  { name: "Friday", role: "Developer Agent", level: "int" as const, sessionKey: "agent:developer:main" },
  { name: "Fury", role: "Customer Researcher", level: "spc" as const, sessionKey: "agent:customer-researcher:main" },
  { name: "Shuri", role: "Product Analyst", level: "spc" as const, sessionKey: "agent:product-analyst:main" },
  { name: "Loki", role: "Content Writer", level: "spc" as const, sessionKey: "agent:content-writer:main" },
  { name: "Pepper", role: "Email Marketing", level: "int" as const, sessionKey: "agent:email-marketing:main" },
  { name: "Quill", role: "Social Media", level: "int" as const, sessionKey: "agent:social-media-manager:main" },
  { name: "Vision", role: "SEO Analyst", level: "spc" as const, sessionKey: "agent:seo-analyst:main" },
  { name: "Wanda", role: "Designer", level: "spc" as const, sessionKey: "agent:designer:main" },
  { name: "Wong", role: "Documentation", level: "spc" as const, sessionKey: "agent:notion-agent:main" },
];

// Query to get all agents
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("agents").collect();
  },
});

// Query to get agent by id
export const getById = query({
  args: { id: v.id("agents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Mutation to create an agent
export const create = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    level: v.union(v.literal("lead"), v.literal("int"), v.literal("spc")),
    sessionKey: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("agents", {
      name: args.name,
      role: args.role,
      level: args.level,
      status: "idle",
      sessionKey: args.sessionKey,
    });
  },
});

// Mutation to update agent status
export const updateStatus = mutation({
  args: {
    id: v.id("agents"),
    status: v.union(
      v.literal("idle"),
      v.literal("active"),
      v.literal("blocked")
    ),
    currentTaskId: v.optional(v.id("tasks")),
  },
  handler: async (ctx, args) => {
    const updates: {
      status: "idle" | "active" | "blocked";
      currentTaskId?: typeof args.currentTaskId;
    } = { status: args.status };
    if (args.currentTaskId !== undefined) {
      updates.currentTaskId = args.currentTaskId;
    }
    await ctx.db.patch(args.id, updates);
    return { success: true };
  },
});

// Seed agents - run once to populate the squad
export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("agents").first();
    if (existing) {
      return { success: false, message: "Agents already seeded" };
    }
    for (const a of SQUAD) {
      await ctx.db.insert("agents", {
        name: a.name,
        role: a.role,
        level: a.level,
        status: "idle",
        sessionKey: a.sessionKey,
      });
    }
    return { success: true, message: `Seeded ${SQUAD.length} agents` };
  },
});

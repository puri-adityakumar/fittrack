import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all exercise logs for a specific date
export const getByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("exerciseLogs")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();
    return logs;
  },
});

// Get exercise logs for a date range
export const getByDateRange = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("exerciseLogs")
      .filter((q) =>
        q.and(
          q.gte(q.field("date"), args.startDate),
          q.lte(q.field("date"), args.endDate)
        )
      )
      .collect();
    return logs;
  },
});

// Get recent exercise logs
export const getRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const logs = await ctx.db
      .query("exerciseLogs")
      .order("desc")
      .take(limit);
    return logs;
  },
});

// Log a new exercise
export const create = mutation({
  args: {
    date: v.string(),
    exerciseId: v.optional(v.string()),
    exerciseName: v.string(),
    sets: v.number(),
    reps: v.number(),
    weight: v.optional(v.number()),
    duration: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const logId = await ctx.db.insert("exerciseLogs", {
      ...args,
      createdAt: new Date().toISOString(),
    });
    return logId;
  },
});

// Update an exercise log
export const update = mutation({
  args: {
    id: v.id("exerciseLogs"),
    sets: v.optional(v.number()),
    reps: v.optional(v.number()),
    weight: v.optional(v.number()),
    duration: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates: Record<string, unknown> = {};
    
    if (updates.sets !== undefined) filteredUpdates.sets = updates.sets;
    if (updates.reps !== undefined) filteredUpdates.reps = updates.reps;
    if (updates.weight !== undefined) filteredUpdates.weight = updates.weight;
    if (updates.duration !== undefined) filteredUpdates.duration = updates.duration;
    if (updates.notes !== undefined) filteredUpdates.notes = updates.notes;

    await ctx.db.patch(id, filteredUpdates);
    return id;
  },
});

// Delete an exercise log
export const remove = mutation({
  args: { id: v.id("exerciseLogs") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },
});

// Get exercise count for today
export const getTodayCount = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    const logs = await ctx.db
      .query("exerciseLogs")
      .withIndex("by_date", (q) => q.eq("date", today))
      .collect();
    return logs.length;
  },
});

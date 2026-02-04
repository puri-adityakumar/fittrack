import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get daily log for a specific date
export const getByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const log = await ctx.db
      .query("dailyLogs")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .first();
    return log;
  },
});

// Get daily logs for a date range (for charts)
export const getByDateRange = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("dailyLogs")
      .filter((q) =>
        q.and(
          q.gte(q.field("date"), args.startDate),
          q.lte(q.field("date"), args.endDate)
        )
      )
      .collect();
    return logs.sort((a, b) => a.date.localeCompare(b.date));
  },
});

// Get last N days of daily logs
export const getRecent = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const days = args.days ?? 7;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - days);

    const logs = await ctx.db
      .query("dailyLogs")
      .filter((q) =>
        q.and(
          q.gte(q.field("date"), startDate.toISOString().split("T")[0]),
          q.lte(q.field("date"), endDate.toISOString().split("T")[0])
        )
      )
      .collect();
    return logs.sort((a, b) => a.date.localeCompare(b.date));
  },
});

// Create or update daily log
export const upsert = mutation({
  args: {
    date: v.string(),
    totalCalories: v.number(),
    totalProtein: v.number(),
    totalCarbs: v.number(),
    totalFat: v.number(),
    exerciseCount: v.number(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("dailyLogs")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return existing._id;
    } else {
      const logId = await ctx.db.insert("dailyLogs", args);
      return logId;
    }
  },
});

// Update daily log
export const update = mutation({
  args: {
    id: v.id("dailyLogs"),
    totalCalories: v.optional(v.number()),
    totalProtein: v.optional(v.number()),
    totalCarbs: v.optional(v.number()),
    totalFat: v.optional(v.number()),
    exerciseCount: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates: Record<string, unknown> = {};

    if (updates.totalCalories !== undefined)
      filteredUpdates.totalCalories = updates.totalCalories;
    if (updates.totalProtein !== undefined)
      filteredUpdates.totalProtein = updates.totalProtein;
    if (updates.totalCarbs !== undefined)
      filteredUpdates.totalCarbs = updates.totalCarbs;
    if (updates.totalFat !== undefined)
      filteredUpdates.totalFat = updates.totalFat;
    if (updates.exerciseCount !== undefined)
      filteredUpdates.exerciseCount = updates.exerciseCount;
    if (updates.notes !== undefined) filteredUpdates.notes = updates.notes;

    await ctx.db.patch(id, filteredUpdates);
    return id;
  },
});

// Recalculate daily totals from meal and exercise logs
export const recalculate = mutation({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    // Get all meal logs for the date
    const mealLogs = await ctx.db
      .query("mealLogs")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();

    // Get all exercise logs for the date
    const exerciseLogs = await ctx.db
      .query("exerciseLogs")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();

    // Calculate totals
    const totals = mealLogs.reduce(
      (acc, log) => ({
        totalCalories: acc.totalCalories + log.calories,
        totalProtein: acc.totalProtein + log.protein,
        totalCarbs: acc.totalCarbs + log.carbs,
        totalFat: acc.totalFat + log.fat,
      }),
      { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
    );

    // Check if daily log exists
    const existing = await ctx.db
      .query("dailyLogs")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .first();

    const data = {
      date: args.date,
      ...totals,
      exerciseCount: exerciseLogs.length,
    };

    if (existing) {
      await ctx.db.patch(existing._id, data);
      return existing._id;
    } else {
      const logId = await ctx.db.insert("dailyLogs", data);
      return logId;
    }
  },
});

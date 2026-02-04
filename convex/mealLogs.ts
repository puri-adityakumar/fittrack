import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all meal logs for a specific date
export const getByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("mealLogs")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();
    return logs;
  },
});

// Get meal logs for a date range
export const getByDateRange = query({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const logs = await ctx.db
      .query("mealLogs")
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

// Get recent meal logs
export const getRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const logs = await ctx.db
      .query("mealLogs")
      .order("desc")
      .take(limit);
    return logs;
  },
});

// Log a new meal
export const create = mutation({
  args: {
    date: v.string(),
    mealType: v.string(),
    foodName: v.string(),
    quantity: v.optional(v.string()),
    calories: v.number(),
    protein: v.number(),
    carbs: v.number(),
    fat: v.number(),
    fiber: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const logId = await ctx.db.insert("mealLogs", {
      ...args,
      createdAt: new Date().toISOString(),
    });
    return logId;
  },
});

// Update a meal log
export const update = mutation({
  args: {
    id: v.id("mealLogs"),
    foodName: v.optional(v.string()),
    quantity: v.optional(v.string()),
    calories: v.optional(v.number()),
    protein: v.optional(v.number()),
    carbs: v.optional(v.number()),
    fat: v.optional(v.number()),
    fiber: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates: Record<string, unknown> = {};

    if (updates.foodName !== undefined) filteredUpdates.foodName = updates.foodName;
    if (updates.quantity !== undefined) filteredUpdates.quantity = updates.quantity;
    if (updates.calories !== undefined) filteredUpdates.calories = updates.calories;
    if (updates.protein !== undefined) filteredUpdates.protein = updates.protein;
    if (updates.carbs !== undefined) filteredUpdates.carbs = updates.carbs;
    if (updates.fat !== undefined) filteredUpdates.fat = updates.fat;
    if (updates.fiber !== undefined) filteredUpdates.fiber = updates.fiber;
    if (updates.notes !== undefined) filteredUpdates.notes = updates.notes;

    await ctx.db.patch(id, filteredUpdates);
    return id;
  },
});

// Delete a meal log
export const remove = mutation({
  args: { id: v.id("mealLogs") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },
});

// Get today's nutrition totals
export const getTodayTotals = query({
  args: {},
  handler: async (ctx) => {
    const today = new Date().toISOString().split("T")[0];
    const logs = await ctx.db
      .query("mealLogs")
      .withIndex("by_date", (q) => q.eq("date", today))
      .collect();

    const totals = logs.reduce(
      (acc, log) => ({
        calories: acc.calories + log.calories,
        protein: acc.protein + log.protein,
        carbs: acc.carbs + log.carbs,
        fat: acc.fat + log.fat,
        mealCount: acc.mealCount + 1,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, mealCount: 0 }
    );

    return totals;
  },
});

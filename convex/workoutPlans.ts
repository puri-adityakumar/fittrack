import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all workout plans
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const plans = await ctx.db.query("workoutPlans").collect();
    return plans;
  },
});

// Get workout plan by ID
export const getById = query({
  args: { id: v.id("workoutPlans") },
  handler: async (ctx, args) => {
    const plan = await ctx.db.get(args.id);
    return plan;
  },
});

// Get workout plans by creator (butler or trainer)
export const getByCreator = query({
  args: { createdBy: v.string() },
  handler: async (ctx, args) => {
    const plans = await ctx.db
      .query("workoutPlans")
      .filter((q) => q.eq(q.field("createdBy"), args.createdBy))
      .collect();
    return plans;
  },
});

// Create a new workout plan
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    exercises: v.array(
      v.object({
        exerciseId: v.optional(v.string()),
        name: v.string(),
        sets: v.number(),
        reps: v.number(),
        restSeconds: v.number(),
      })
    ),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const planId = await ctx.db.insert("workoutPlans", {
      ...args,
      createdAt: new Date().toISOString(),
    });
    return planId;
  },
});

// Update a workout plan
export const update = mutation({
  args: {
    id: v.id("workoutPlans"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    exercises: v.optional(
      v.array(
        v.object({
          exerciseId: v.optional(v.string()),
          name: v.string(),
          sets: v.number(),
          reps: v.number(),
          restSeconds: v.number(),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filteredUpdates: Record<string, unknown> = {};

    if (updates.name !== undefined) filteredUpdates.name = updates.name;
    if (updates.description !== undefined)
      filteredUpdates.description = updates.description;
    if (updates.exercises !== undefined)
      filteredUpdates.exercises = updates.exercises;

    await ctx.db.patch(id, filteredUpdates);
    return id;
  },
});

// Delete a workout plan
export const remove = mutation({
  args: { id: v.id("workoutPlans") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
    return true;
  },
});

// Delete all workout plans (for reset)
export const removeAll = mutation({
  args: {},
  handler: async (ctx) => {
    const plans = await ctx.db.query("workoutPlans").collect();
    for (const plan of plans) {
      await ctx.db.delete(plan._id);
    }
    return true;
  },
});

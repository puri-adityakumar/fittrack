import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get the user profile (single user app)
export const get = query({
  args: {},
  handler: async (ctx) => {
    const profile = await ctx.db.query("userProfile").first();
    return profile;
  },
});

// Create user profile (called during onboarding)
export const create = mutation({
  args: {
    name: v.string(),
    height: v.number(),
    weight: v.number(),
    age: v.optional(v.number()),
    fitnessGoal: v.string(),
    dailyCalorieTarget: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Check if profile already exists
    const existing = await ctx.db.query("userProfile").first();
    if (existing) {
      throw new Error("Profile already exists. Use update instead.");
    }

    const now = new Date().toISOString();
    const profileId = await ctx.db.insert("userProfile", {
      ...args,
      createdAt: now,
      updatedAt: now,
    });
    return profileId;
  },
});

// Update user profile
export const update = mutation({
  args: {
    name: v.optional(v.string()),
    height: v.optional(v.number()),
    weight: v.optional(v.number()),
    age: v.optional(v.number()),
    fitnessGoal: v.optional(v.string()),
    dailyCalorieTarget: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db.query("userProfile").first();
    if (!profile) {
      throw new Error("No profile found. Create one first.");
    }

    const updates: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    // Only update provided fields
    if (args.name !== undefined) updates.name = args.name;
    if (args.height !== undefined) updates.height = args.height;
    if (args.weight !== undefined) updates.weight = args.weight;
    if (args.age !== undefined) updates.age = args.age;
    if (args.fitnessGoal !== undefined) updates.fitnessGoal = args.fitnessGoal;
    if (args.dailyCalorieTarget !== undefined)
      updates.dailyCalorieTarget = args.dailyCalorieTarget;

    await ctx.db.patch(profile._id, updates);
    return profile._id;
  },
});

// Delete user profile (for reset)
export const remove = mutation({
  args: {},
  handler: async (ctx) => {
    const profile = await ctx.db.query("userProfile").first();
    if (profile) {
      await ctx.db.delete(profile._id);
    }
    return true;
  },
});

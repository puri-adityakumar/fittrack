import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Single user profile - stores name, height, weight, goals
  userProfile: defineTable({
    name: v.string(),
    height: v.number(), // cm
    weight: v.number(), // kg
    age: v.optional(v.number()),
    fitnessGoal: v.string(), // "lose_weight", "build_muscle", "maintain"
    dailyCalorieTarget: v.optional(v.number()),
    createdAt: v.string(),
    updatedAt: v.string(),
  }),

  // Exercise logs - track daily workouts
  // Example: "Day 1: I did bench press 3 sets of 10 at 60kg"
  exerciseLogs: defineTable({
    date: v.string(), // "2026-02-04"
    exerciseId: v.optional(v.string()), // from ExerciseDB API
    exerciseName: v.string(),
    sets: v.number(),
    reps: v.number(),
    weight: v.optional(v.number()), // kg
    duration: v.optional(v.number()), // minutes for cardio
    notes: v.optional(v.string()),
    createdAt: v.string(),
  }).index("by_date", ["date"]),

  // Meal logs - track food with auto-filled nutrition
  // Example: "I ate chicken rice" -> auto-fill calories, protein, carbs, fat
  mealLogs: defineTable({
    date: v.string(),
    mealType: v.string(), // "breakfast", "lunch", "dinner", "snack"
    foodName: v.string(),
    quantity: v.optional(v.string()), // "1 bowl", "200g"
    calories: v.number(),
    protein: v.number(), // grams
    carbs: v.number(), // grams
    fat: v.number(), // grams
    fiber: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.string(),
  }).index("by_date", ["date"]),

  // Daily summary - aggregated stats for each day
  dailyLogs: defineTable({
    date: v.string(),
    totalCalories: v.number(),
    totalProtein: v.number(),
    totalCarbs: v.number(),
    totalFat: v.number(),
    exerciseCount: v.number(),
    notes: v.optional(v.string()),
  }).index("by_date", ["date"]),

  // Workout plans - suggested by Butler/Trainer agents
  workoutPlans: defineTable({
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
    createdBy: v.string(), // "butler" or "trainer"
    createdAt: v.string(),
  }),
});

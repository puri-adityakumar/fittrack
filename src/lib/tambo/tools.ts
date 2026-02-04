import { defineTool } from "@tambo-ai/react";
import { z } from "zod";
import { getConvexClient } from "@/lib/convex/client";
import { api } from "../../../convex/_generated/api";

/**
 * Tambo Tools for FitTrack
 * 
 * These tools allow the AI agents to interact with the app's data
 * and external services like ExerciseDB.
 */

const resolveDate = (date?: string) =>
  date || new Date().toISOString().split("T")[0];

const getDateRange = (days: number) => {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - Math.max(days - 1, 0));
  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
};

// ============================================
// EXERCISE TOOLS (Butler)
// ============================================

export const logExerciseTool = defineTool({
  name: "logExercise",
  description: "Log a completed exercise with sets, reps, and optional weight. Use this when the user says they did an exercise.",
  inputSchema: z.object({
    exerciseId: z.string().optional().describe("ExerciseDB ID (optional)"),
    exerciseName: z.string().describe("Name of the exercise (e.g., 'Bench Press', 'Squats')"),
    sets: z.number().min(1).describe("Number of sets completed"),
    reps: z.number().min(1).describe("Number of reps per set"),
    weight: z.number().optional().describe("Weight used in kg (optional for bodyweight exercises)"),
    duration: z.number().optional().describe("Duration in minutes (for cardio exercises)"),
    date: z.string().optional().describe("Date in YYYY-MM-DD format. Defaults to today."),
    notes: z.string().optional().describe("Additional notes about the exercise"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
    exerciseId: z.string().optional(),
  }),
  tool: async (input) => {
    const date = resolveDate(input.date);
    try {
      const convex = getConvexClient();
      const exerciseId = await convex.mutation(api.exerciseLogs.create, {
        date,
        exerciseId: input.exerciseId,
        exerciseName: input.exerciseName,
        sets: input.sets,
        reps: input.reps,
        weight: input.weight,
        duration: input.duration,
        notes: input.notes,
      });

      await convex.mutation(api.dailyLogs.recalculate, { date });

      return {
        success: true,
        message: `Logged: ${input.exerciseName} - ${input.sets} sets × ${input.reps} reps${input.weight ? ` @ ${input.weight}kg` : ""}`,
        exerciseId,
      };
    } catch (error) {
      console.error("Failed to log exercise:", error);
      return {
        success: false,
        message: "Failed to log exercise. Check Convex connection.",
      };
    }
  },
});

export const getDailyExercisesTool = defineTool({
  name: "getDailyExercises",
  description: "Get all exercises logged for a specific date",
  inputSchema: z.object({
    date: z.string().optional().describe("Date in YYYY-MM-DD format. Defaults to today."),
  }),
  outputSchema: z.object({
    exercises: z.array(z.object({
      name: z.string(),
      sets: z.number(),
      reps: z.number(),
      weight: z.number().optional(),
    })),
    count: z.number(),
  }),
  tool: async (input) => {
    const date = resolveDate(input.date);
    try {
      const convex = getConvexClient();
      const logs = await convex.query(api.exerciseLogs.getByDate, { date });
      return {
        exercises: logs.map((log) => ({
          name: log.exerciseName,
          sets: log.sets,
          reps: log.reps,
          weight: log.weight,
        })),
        count: logs.length,
      };
    } catch (error) {
      console.error("Failed to fetch exercises:", error);
      return {
        exercises: [],
        count: 0,
      };
    }
  },
});

// ============================================
// MEAL TOOLS (Butler)
// ============================================

export const logMealTool = defineTool({
  name: "logMeal",
  description: "Log a meal with food name. The AI will estimate calories and macros. Use this when the user says they ate something.",
  inputSchema: z.object({
    foodName: z.string().describe("Description of the food (e.g., 'chicken rice', '2 eggs and toast')"),
    mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]).describe("Type of meal"),
    quantity: z.string().optional().describe("Quantity description (e.g., '1 bowl', '200g')"),
    date: z.string().optional().describe("Date in YYYY-MM-DD format. Defaults to today."),
    fiber: z.number().optional().describe("Estimated fiber in grams"),
    // AI-estimated nutrition (these come from the AI's response)
    calories: z.number().describe("Estimated calories"),
    protein: z.number().describe("Estimated protein in grams"),
    carbs: z.number().describe("Estimated carbohydrates in grams"),
    fat: z.number().describe("Estimated fat in grams"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
    mealId: z.string().optional(),
  }),
  tool: async (input) => {
    const date = resolveDate(input.date);
    try {
      const convex = getConvexClient();
      const mealId = await convex.mutation(api.mealLogs.create, {
        date,
        mealType: input.mealType,
        foodName: input.foodName,
        quantity: input.quantity,
        calories: input.calories,
        protein: input.protein,
        carbs: input.carbs,
        fat: input.fat,
        fiber: input.fiber,
        notes: undefined,
      });

      await convex.mutation(api.dailyLogs.recalculate, { date });

      return {
        success: true,
        message: `Logged ${input.mealType}: ${input.foodName} - ${input.calories} cal | ${input.protein}g protein | ${input.carbs}g carbs | ${input.fat}g fat`,
        mealId,
      };
    } catch (error) {
      console.error("Failed to log meal:", error);
      return {
        success: false,
        message: "Failed to log meal. Check Convex connection.",
      };
    }
  },
});

export const getDailyMealsTool = defineTool({
  name: "getDailyMeals",
  description: "Get all meals logged for a specific date with nutrition totals",
  inputSchema: z.object({
    date: z.string().optional().describe("Date in YYYY-MM-DD format. Defaults to today."),
  }),
  outputSchema: z.object({
    meals: z.array(z.object({
      foodName: z.string(),
      mealType: z.string(),
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fat: z.number(),
    })),
    totals: z.object({
      calories: z.number(),
      protein: z.number(),
      carbs: z.number(),
      fat: z.number(),
    }),
  }),
  tool: async (input) => {
    const date = resolveDate(input.date);
    try {
      const convex = getConvexClient();
      const logs = await convex.query(api.mealLogs.getByDate, { date });

      const totals = logs.reduce(
        (acc, log) => ({
          calories: acc.calories + log.calories,
          protein: acc.protein + log.protein,
          carbs: acc.carbs + log.carbs,
          fat: acc.fat + log.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      );

      return {
        meals: logs.map((log) => ({
          foodName: log.foodName,
          mealType: log.mealType,
          calories: log.calories,
          protein: log.protein,
          carbs: log.carbs,
          fat: log.fat,
        })),
        totals,
      };
    } catch (error) {
      console.error("Failed to fetch meals:", error);
      return {
        meals: [],
        totals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
      };
    }
  },
});

// ============================================
// PROGRESS TOOLS (Butler)
// ============================================

export const getDailyProgressTool = defineTool({
  name: "getDailyProgress",
  description: "Get today's overall progress including exercises and nutrition",
  inputSchema: z.object({
    date: z.string().optional().describe("Date in YYYY-MM-DD format. Defaults to today."),
  }),
  outputSchema: z.object({
    date: z.string(),
    exerciseCount: z.number(),
    totalCalories: z.number(),
    totalProtein: z.number(),
    totalCarbs: z.number(),
    totalFat: z.number(),
    calorieTarget: z.number(),
    calorieProgress: z.number().describe("Percentage of calorie target consumed"),
  }),
  tool: async (input) => {
    const date = resolveDate(input.date);
    try {
      const convex = getConvexClient();
      let dailyLog = await convex.query(api.dailyLogs.getByDate, { date });
      if (!dailyLog) {
        await convex.mutation(api.dailyLogs.recalculate, { date });
        dailyLog = await convex.query(api.dailyLogs.getByDate, { date });
      }

      const profile = await convex.query(api.userProfile.get, {});
      const calorieTarget = profile?.dailyCalorieTarget ?? 2000;
      const totalCalories = dailyLog?.totalCalories ?? 0;
      const calorieProgress =
        calorieTarget > 0 ? (totalCalories / calorieTarget) * 100 : 0;

      return {
        date,
        exerciseCount: dailyLog?.exerciseCount ?? 0,
        totalCalories,
        totalProtein: dailyLog?.totalProtein ?? 0,
        totalCarbs: dailyLog?.totalCarbs ?? 0,
        totalFat: dailyLog?.totalFat ?? 0,
        calorieTarget,
        calorieProgress,
      };
    } catch (error) {
      console.error("Failed to fetch daily progress:", error);
      return {
        date,
        exerciseCount: 0,
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        calorieTarget: 2000,
        calorieProgress: 0,
      };
    }
  },
});

export const getWeeklyStatsTool = defineTool({
  name: "getWeeklyStats",
  description: "Get statistics for the past 7 days",
  inputSchema: z.object({}),
  outputSchema: z.object({
    totalExercises: z.number(),
    avgCalories: z.number(),
    avgProtein: z.number(),
    daysTracked: z.number(),
    streakDays: z.number(),
  }),
  tool: async () => {
    try {
      const convex = getConvexClient();
      const logs = await convex.query(api.dailyLogs.getRecent, { days: 7 });
      const daysTracked = logs.length;
      const totals = logs.reduce(
        (acc, log) => ({
          totalCalories: acc.totalCalories + log.totalCalories,
          totalProtein: acc.totalProtein + log.totalProtein,
          totalExercises: acc.totalExercises + log.exerciseCount,
        }),
        { totalCalories: 0, totalProtein: 0, totalExercises: 0 }
      );

      const avgCalories =
        daysTracked > 0 ? Math.round(totals.totalCalories / daysTracked) : 0;
      const avgProtein =
        daysTracked > 0 ? Math.round(totals.totalProtein / daysTracked) : 0;

      return {
        totalExercises: totals.totalExercises,
        avgCalories,
        avgProtein,
        daysTracked,
        streakDays: daysTracked,
      };
    } catch (error) {
      console.error("Failed to fetch weekly stats:", error);
      return {
        totalExercises: 0,
        avgCalories: 0,
        avgProtein: 0,
        daysTracked: 0,
        streakDays: 0,
      };
    }
  },
});

// ============================================
// USER PROFILE TOOLS (Trainer)
// ============================================

export const getUserProfileTool = defineTool({
  name: "getUserProfile",
  description: "Get the user's profile including fitness goal and stats",
  inputSchema: z.object({}),
  outputSchema: z.object({
    name: z.string(),
    height: z.number(),
    weight: z.number(),
    age: z.number().optional(),
    fitnessGoal: z.string(),
    dailyCalorieTarget: z.number().optional(),
  }),
  tool: async () => {
    try {
      const convex = getConvexClient();
      const profile = await convex.query(api.userProfile.get, {});
      if (!profile) {
        return {
          name: "User",
          height: 170,
          weight: 70,
          age: 25,
          fitnessGoal: "maintain",
          dailyCalorieTarget: 2000,
        };
      }
      return {
        name: profile.name,
        height: profile.height,
        weight: profile.weight,
        age: profile.age,
        fitnessGoal: profile.fitnessGoal,
        dailyCalorieTarget: profile.dailyCalorieTarget,
      };
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      return {
        name: "User",
        height: 170,
        weight: 70,
        age: 25,
        fitnessGoal: "maintain",
        dailyCalorieTarget: 2000,
      };
    }
  },
});

export const getUserProgressHistoryTool = defineTool({
  name: "getUserProgressHistory",
  description: "Get the user's exercise and nutrition history for analysis",
  inputSchema: z.object({
    days: z.number().default(7).describe("Number of days to look back"),
  }),
  outputSchema: z.object({
    exercises: z.array(z.object({
      date: z.string(),
      name: z.string(),
      sets: z.number(),
      reps: z.number(),
      weight: z.number().optional(),
    })),
    dailyStats: z.array(z.object({
      date: z.string(),
      calories: z.number(),
      exerciseCount: z.number(),
    })),
  }),
  tool: async (input) => {
    try {
      const convex = getConvexClient();
      const range = getDateRange(input.days);
      const exercises = await convex.query(api.exerciseLogs.getByDateRange, range);
      const dailyStats = await convex.query(api.dailyLogs.getRecent, {
        days: input.days,
      });

      return {
        exercises: exercises.map((log) => ({
          date: log.date,
          name: log.exerciseName,
          sets: log.sets,
          reps: log.reps,
          weight: log.weight,
        })),
        dailyStats: dailyStats.map((log) => ({
          date: log.date,
          calories: log.totalCalories,
          exerciseCount: log.exerciseCount,
        })),
      };
    } catch (error) {
      console.error("Failed to fetch progress history:", error);
      return {
        exercises: [],
        dailyStats: [],
      };
    }
  },
});

// ============================================
// WORKOUT PLAN TOOLS (Trainer)
// ============================================

export const createWorkoutPlanTool = defineTool({
  name: "createWorkoutPlan",
  description: "Create and save a new workout plan for the user",
  inputSchema: z.object({
    name: z.string().describe("Name of the workout plan"),
    description: z.string().optional().describe("Description of the plan"),
    exercises: z.array(z.object({
      name: z.string(),
      sets: z.number(),
      reps: z.number(),
      restSeconds: z.number().default(60),
    })).describe("List of exercises in the plan"),
  }),
  outputSchema: z.object({
    success: z.boolean(),
    message: z.string(),
    planId: z.string().optional(),
  }),
  tool: async (input) => {
    try {
      const convex = getConvexClient();
      const planId = await convex.mutation(api.workoutPlans.create, {
        name: input.name,
        description: input.description,
        exercises: input.exercises.map((exercise) => ({
          name: exercise.name,
          sets: exercise.sets,
          reps: exercise.reps,
          restSeconds: exercise.restSeconds ?? 60,
        })),
        createdBy: "trainer",
      });

      return {
        success: true,
        message: `Created workout plan: ${input.name} with ${input.exercises.length} exercises`,
        planId,
      };
    } catch (error) {
      console.error("Failed to create workout plan:", error);
      return {
        success: false,
        message: "Failed to create workout plan. Check Convex connection.",
      };
    }
  },
});

export const getWorkoutPlansTool = defineTool({
  name: "getWorkoutPlans",
  description: "Get all saved workout plans",
  inputSchema: z.object({}),
  outputSchema: z.object({
    plans: z.array(z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().optional(),
      exerciseCount: z.number(),
    })),
  }),
  tool: async () => {
    try {
      const convex = getConvexClient();
      const plans = await convex.query(api.workoutPlans.getAll, {});
      return {
        plans: plans.map((plan) => ({
          id: plan._id,
          name: plan.name,
          description: plan.description,
          exerciseCount: plan.exercises.length,
        })),
      };
    } catch (error) {
      console.error("Failed to fetch workout plans:", error);
      return {
        plans: [],
      };
    }
  },
});

// ============================================
// TOOL COLLECTIONS
// ============================================

// Tools for Butler agent (logging, tracking)
export const butlerTools = [
  logExerciseTool,
  getDailyExercisesTool,
  logMealTool,
  getDailyMealsTool,
  getDailyProgressTool,
  getWeeklyStatsTool,
];

// Tools for Trainer agent (advice, analysis)
export const trainerTools = [
  getUserProfileTool,
  getUserProgressHistoryTool,
  createWorkoutPlanTool,
  getWorkoutPlansTool,
  getDailyExercisesTool,
  getDailyMealsTool,
];

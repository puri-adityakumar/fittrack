import { defineTool } from "@tambo-ai/react";
import { z } from "zod";

/**
 * Tambo Tools for FitTrack
 * 
 * These tools allow the AI agents to interact with the app's data
 * and external services like ExerciseDB.
 */

// ============================================
// EXERCISE TOOLS (Butler)
// ============================================

export const logExerciseTool = defineTool({
  name: "logExercise",
  description: "Log a completed exercise with sets, reps, and optional weight. Use this when the user says they did an exercise.",
  inputSchema: z.object({
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
    // This will be implemented to call Convex mutation
    const date = input.date || new Date().toISOString().split("T")[0];
    
    // For now, return a mock response
    // In production, this calls: api.exerciseLogs.create
    console.log("Logging exercise:", input);
    
    return {
      success: true,
      message: `Logged: ${input.exerciseName} - ${input.sets} sets × ${input.reps} reps${input.weight ? ` @ ${input.weight}kg` : ""}`,
      exerciseId: "mock-id",
    };
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
    const date = input.date || new Date().toISOString().split("T")[0];
    
    // For now, return mock data
    // In production, this calls: api.exerciseLogs.getByDate
    console.log("Getting exercises for:", date);
    
    return {
      exercises: [],
      count: 0,
    };
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
    const date = input.date || new Date().toISOString().split("T")[0];
    
    // For now, return a mock response
    // In production, this calls: api.mealLogs.create
    console.log("Logging meal:", input);
    
    return {
      success: true,
      message: `Logged ${input.mealType}: ${input.foodName} - ${input.calories} cal | ${input.protein}g protein | ${input.carbs}g carbs | ${input.fat}g fat`,
      mealId: "mock-id",
    };
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
    const date = input.date || new Date().toISOString().split("T")[0];
    
    // For now, return mock data
    console.log("Getting meals for:", date);
    
    return {
      meals: [],
      totals: { calories: 0, protein: 0, carbs: 0, fat: 0 },
    };
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
    const date = input.date || new Date().toISOString().split("T")[0];
    
    // For now, return mock data
    console.log("Getting daily progress for:", date);
    
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
    // For now, return mock data
    console.log("Getting weekly stats");
    
    return {
      totalExercises: 0,
      avgCalories: 0,
      avgProtein: 0,
      daysTracked: 0,
      streakDays: 0,
    };
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
    // For now, return mock data
    console.log("Getting user profile");
    
    return {
      name: "User",
      height: 170,
      weight: 70,
      age: 25,
      fitnessGoal: "maintain",
      dailyCalorieTarget: 2000,
    };
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
    console.log("Getting progress history for", input.days, "days");
    
    return {
      exercises: [],
      dailyStats: [],
    };
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
    console.log("Creating workout plan:", input);
    
    return {
      success: true,
      message: `Created workout plan: ${input.name} with ${input.exercises.length} exercises`,
      planId: "mock-id",
    };
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
    console.log("Getting workout plans");
    
    return {
      plans: [],
    };
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

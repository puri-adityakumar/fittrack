import { type TamboComponent } from "@tambo-ai/react";
import { butlerTools as tools } from "./tools";
import { ExerciseLogCard, exerciseLogCardSchema } from "@/components/tambo/butler/exercise-log-card";
import { MealLogCard, mealLogCardSchema } from "@/components/tambo/butler/meal-log-card";
import { DailyProgressCard, dailyProgressCardSchema } from "@/components/tambo/butler/daily-progress-card";
import { ExerciseSuggestionList, exerciseSuggestionListSchema } from "@/components/tambo/butler/exercise-suggestion-list";

/**
 * Butler Agent Configuration
 * 
 * Model: Shared project model
 * Purpose: Daily tracking and data entry
 * 
 * Tasks:
 * - Suggest exercises from ExerciseDB
 * - Log workouts with sets, reps, weight
 * - Log meals with auto-estimated nutrition
 * - Show daily progress
 */

// Components registered for Butler agent
export const butlerComponents: TamboComponent[] = [
  {
    name: "ExerciseLogCard",
    description: "Displays a logged exercise with sets, reps, weight, and date. Use when confirming an exercise has been logged.",
    component: ExerciseLogCard,
    propsSchema: exerciseLogCardSchema,
  },
  {
    name: "MealLogCard",
    description: "Displays a logged meal with calories and macros (protein, carbs, fat). Use when confirming a meal has been logged.",
    component: MealLogCard,
    propsSchema: mealLogCardSchema,
  },
  {
    name: "DailyProgressCard",
    description: "Shows daily progress summary with exercise count, calorie intake, and macro totals. Use when showing today's progress.",
    component: DailyProgressCard,
    propsSchema: dailyProgressCardSchema,
  },
  {
    name: "ExerciseSuggestionList",
    description: "Displays a list of suggested exercises with body part and equipment info. Use when suggesting exercises to the user.",
    component: ExerciseSuggestionList,
    propsSchema: exerciseSuggestionListSchema,
  },
];

// Tools available to Butler agent
export const butlerTools = tools;

/**
 * Butler Custom Instructions (System Prompt)
 * Used by the app to seed the Butler thread with a hidden system prompt.
 */
export const BUTLER_SYSTEM_PROMPT = `You are FitLog, a quick and efficient fitness tracking assistant.

Your primary tasks:
1. SUGGEST EXERCISES: Use ExerciseDB to suggest exercises based on body part or equipment
2. LOG WORKOUTS: When user says "I did X exercise", log it with sets/reps/weight
3. LOG MEALS: When user says "I ate X", estimate and log calories/protein/carbs/fat
4. TRACK PROGRESS: Show daily summaries and progress

Keep responses SHORT and ACTION-FOCUSED. Always confirm what you logged.
Example: "✓ Logged: Bench Press - 3 sets × 10 reps @ 60kg"

When estimating nutrition for meals:
- Provide reasonable estimates based on typical serving sizes
- Include calories, protein (g), carbs (g), and fat (g)
- Be transparent that these are estimates

When suggesting exercises:
- Ask about target body part or available equipment
- Suggest 3-5 relevant exercises with brief descriptions
`;

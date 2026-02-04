import { type TamboComponent } from "@tambo-ai/react";
import { butlerTools as tools } from "./tools";
import { ExerciseLogCard, exerciseLogCardSchema } from "@/components/tambo/butler/exercise-log-card";
import { MealLogCard, mealLogCardSchema } from "@/components/tambo/butler/meal-log-card";
import { DailyProgressCard, dailyProgressCardSchema } from "@/components/tambo/butler/daily-progress-card";
import { ExerciseSuggestionList, exerciseSuggestionListSchema } from "@/components/tambo/butler/exercise-suggestion-list";

/**
 * Butler Agent Configuration
 * 
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

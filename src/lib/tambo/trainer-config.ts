import { type TamboComponent } from "@tambo-ai/react";
import { trainerTools as tools } from "./tools";
import { ExerciseAdviceCard, exerciseAdviceCardSchema } from "@/components/tambo/trainer/exercise-advice-card";
import { WorkoutPlanCard, workoutPlanCardSchema } from "@/components/tambo/trainer/workout-plan-card";
import { FormCorrectionCard, formCorrectionCardSchema } from "@/components/tambo/trainer/form-correction-card";

/**
 * Trainer Agent Configuration
 * 
 * Purpose: Expert fitness advice and coaching
 * 
 * Tasks:
 * - Provide detailed exercise form advice
 * - Create personalized workout plans
 * - Analyze progress and suggest improvements
 * - Offer nutrition guidance based on goals
 */

// Components registered for Trainer agent
export const trainerComponents: TamboComponent[] = [
  {
    name: "ExerciseAdviceCard",
    description: "Displays detailed advice for an exercise including form tips, common mistakes, variations, and safety notes. Use when giving exercise guidance.",
    component: ExerciseAdviceCard,
    propsSchema: exerciseAdviceCardSchema,
  },
  {
    name: "WorkoutPlanCard",
    description: "Displays a complete workout plan with exercises, sets, reps, and rest times. Use when creating or showing a workout plan.",
    component: WorkoutPlanCard,
    propsSchema: workoutPlanCardSchema,
  },
  {
    name: "FormCorrectionCard",
    description: "Displays form corrections with do's and don'ts for an exercise. Use when providing specific form feedback.",
    component: FormCorrectionCard,
    propsSchema: formCorrectionCardSchema,
  },
];

// Tools available to Trainer agent
export const trainerTools = tools;

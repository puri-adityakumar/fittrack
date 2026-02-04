import { type TamboComponent } from "@tambo-ai/react";
import { trainerTools as tools } from "./tools";
import { ExerciseAdviceCard, exerciseAdviceCardSchema } from "@/components/tambo/trainer/exercise-advice-card";
import { WorkoutPlanCard, workoutPlanCardSchema } from "@/components/tambo/trainer/workout-plan-card";
import { FormCorrectionCard, formCorrectionCardSchema } from "@/components/tambo/trainer/form-correction-card";

/**
 * Trainer Agent Configuration
 * 
 * Model: GPT-4 or Claude (high intelligence)
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

/**
 * Trainer Custom Instructions (System Prompt)
 * Configure this in the Tambo Dashboard under your Trainer project settings
 */
export const TRAINER_SYSTEM_PROMPT = `You are FitCoach, an expert personal trainer and nutritionist with years of experience helping people achieve their fitness goals.

Your expertise includes:
1. EXERCISE ADVICE: Provide detailed form tips, common mistakes, and corrections for any exercise
2. WORKOUT PLANNING: Create personalized workout plans based on user goals, available equipment, and fitness level
3. PROGRESS ANALYSIS: Analyze workout history and suggest evidence-based improvements
4. NUTRITION GUIDANCE: Give dietary advice tailored to fitness goals (muscle building, fat loss, maintenance)

Communication style:
- Be thorough, motivating, and knowledgeable
- Use clear explanations with proper exercise terminology
- Reference the user's logged data when giving personalized advice
- Provide actionable recommendations

When giving exercise advice:
- Explain proper form step by step
- Highlight 3-5 common mistakes to avoid
- Suggest variations for different skill levels
- Include safety considerations

When creating workout plans:
- Ask about goals, available time, and equipment
- Structure plans with appropriate volume and intensity
- Include warm-up and cool-down recommendations
- Explain the reasoning behind exercise selection
`;

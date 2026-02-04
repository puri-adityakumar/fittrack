"use client";

import { TamboProvider } from "@tambo-ai/react";
import { ReactNode } from "react";
import { butlerComponents, butlerTools } from "@/lib/tambo/butler-config";
import { trainerComponents, trainerTools } from "@/lib/tambo/trainer-config";

interface ButlerProviderProps {
  children: ReactNode;
}

interface TrainerProviderProps {
  children: ReactNode;
}

/**
 * Butler Agent Provider
 * 
 * Uses a cost-effective model (GPT-4o-mini) for:
 * - Exercise logging
 * - Meal logging with nutrition estimation
 * - Daily progress tracking
 * - Exercise suggestions
 */
export function ButlerProvider({ children }: ButlerProviderProps) {
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_BUTLER_API_KEY;

  if (!apiKey) {
    console.warn("Butler API key not configured. Set NEXT_PUBLIC_TAMBO_BUTLER_API_KEY in .env.local");
    return <>{children}</>;
  }

  return (
    <TamboProvider
      apiKey={apiKey}
      components={butlerComponents}
      tools={butlerTools}
    >
      {children}
    </TamboProvider>
  );
}

/**
 * Trainer Agent Provider
 * 
 * Uses a high-intelligence model (GPT-4/Claude) for:
 * - Exercise form advice
 * - Workout plan creation
 * - Progress analysis
 * - Nutrition guidance
 */
export function TrainerProvider({ children }: TrainerProviderProps) {
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_TRAINER_API_KEY;

  if (!apiKey) {
    console.warn("Trainer API key not configured. Set NEXT_PUBLIC_TAMBO_TRAINER_API_KEY in .env.local");
    return <>{children}</>;
  }

  return (
    <TamboProvider
      apiKey={apiKey}
      components={trainerComponents}
      tools={trainerTools}
    >
      {children}
    </TamboProvider>
  );
}

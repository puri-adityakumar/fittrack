"use client";

import { TamboProvider } from "@tambo-ai/react";
import { ReactNode } from "react";
import {
  BUTLER_SYSTEM_PROMPT,
  butlerComponents,
  butlerTools,
} from "@/lib/tambo/butler-config";
import {
  TRAINER_SYSTEM_PROMPT,
  trainerComponents,
  trainerTools,
} from "@/lib/tambo/trainer-config";

interface ButlerProviderProps {
  children: ReactNode;
}

interface TrainerProviderProps {
  children: ReactNode;
}

const allComponents = [...butlerComponents, ...trainerComponents];
const allTools = [
  ...new Map(
    [...butlerTools, ...trainerTools].map((tool) => [tool.name, tool])
  ).values(),
];

const SYSTEM_PROMPT_PREFIX = "[[SYSTEM_PROMPT]]";
const createInitialMessages = (prompt: string) => [
  {
    role: "assistant" as const,
    content: `${SYSTEM_PROMPT_PREFIX}\n${prompt}`,
    additionalContext: { hidden: true, systemPrompt: true },
  },
];

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
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;

  if (!apiKey) {
    console.warn(
      "Tambo API key not configured. Set NEXT_PUBLIC_TAMBO_API_KEY in .env.local"
    );
    return <>{children}</>;
  }

  return (
    <TamboProvider
      apiKey={apiKey}
      components={allComponents}
      tools={allTools}
      contextKey="butler"
      initialMessages={createInitialMessages(BUTLER_SYSTEM_PROMPT)}
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
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;

  if (!apiKey) {
    console.warn(
      "Tambo API key not configured. Set NEXT_PUBLIC_TAMBO_API_KEY in .env.local"
    );
    return <>{children}</>;
  }

  return (
    <TamboProvider
      apiKey={apiKey}
      components={allComponents}
      tools={allTools}
      contextKey="trainer"
      initialMessages={createInitialMessages(TRAINER_SYSTEM_PROMPT)}
    >
      {children}
    </TamboProvider>
  );
}

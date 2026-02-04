"use client";

import { TamboProvider } from "@tambo-ai/react";
import { ReactNode } from "react";
import {
  butlerComponents,
  butlerTools,
} from "@/lib/tambo/butler-config";
import {
  trainerComponents,
  trainerTools,
} from "@/lib/tambo/trainer-config";

interface ButlerProviderProps {
  children: ReactNode;
}

interface TrainerProviderProps {
  children: ReactNode;
}

// Combine all components and tools for a unified registry
const allComponents = [...butlerComponents, ...trainerComponents];
const allTools = [
  ...new Map(
    [...butlerTools, ...trainerTools].map((tool) => [tool.name, tool])
  ).values(),
];

/**
 * Butler Agent Provider
 * 
 * Uses Tambo for:
 * - Exercise logging
 * - Meal logging with nutrition estimation
 * - Daily progress tracking
 * - Exercise suggestions
 */
export function ButlerProvider({ children }: ButlerProviderProps) {
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">
            Tambo API Key Missing
          </h2>
          <p className="text-yellow-700 text-sm">
            Please set <code className="bg-yellow-100 px-1 rounded">NEXT_PUBLIC_TAMBO_API_KEY</code> in your <code className="bg-yellow-100 px-1 rounded">.env.local</code> file.
          </p>
          <p className="text-yellow-600 text-xs mt-2">
            Get your API key from <a href="https://console.tambo.co" target="_blank" rel="noopener noreferrer" className="underline">console.tambo.co</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <TamboProvider
      apiKey={apiKey}
      components={allComponents}
      tools={allTools}
      contextKey="butler"
    >
      {children}
    </TamboProvider>
  );
}

/**
 * Trainer Agent Provider
 * 
 * Uses Tambo for:
 * - Exercise form advice
 * - Workout plan creation
 * - Progress analysis
 * - Nutrition guidance
 */
export function TrainerProvider({ children }: TrainerProviderProps) {
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center p-8 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">
            Tambo API Key Missing
          </h2>
          <p className="text-yellow-700 text-sm">
            Please set <code className="bg-yellow-100 px-1 rounded">NEXT_PUBLIC_TAMBO_API_KEY</code> in your <code className="bg-yellow-100 px-1 rounded">.env.local</code> file.
          </p>
          <p className="text-yellow-600 text-xs mt-2">
            Get your API key from <a href="https://console.tambo.co" target="_blank" rel="noopener noreferrer" className="underline">console.tambo.co</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <TamboProvider
      apiKey={apiKey}
      components={allComponents}
      tools={allTools}
      contextKey="trainer"
    >
      {children}
    </TamboProvider>
  );
}

# AGENTS.md - AI Coding Agent Instructions

## Project Overview

**FitTrack** - An AI-powered gym report tracker built with Tambo for generative UI.

Single-user fitness tracking with two AI agents and one Tambo project:
- **Butler Agent**: Daily tracking and data entry
- **Trainer Agent**: Expert fitness advice and planning

Both agents share the same Tambo project and model; their behavior differs via separate system prompts.

## Build & Development Commands

```bash
# Development
bun run dev              # Start Next.js dev server
bunx convex dev          # Start Convex dev server (run in separate terminal)

# Building
bun run build            # Build for production
bun run start            # Start production server

# Linting
bun run lint             # Run ESLint on all files
bun run lint -- --fix    # Auto-fix ESLint issues

# Note: No test framework configured. To add tests, use Jest or Vitest.
```

## Code Style Guidelines

### TypeScript

- **Strict mode enabled** - always use proper types
- Prefer `interface` over `type` for object shapes
- Use `type` for unions and complex type operations
- Export shared types from dedicated files

```typescript
// ✅ Interface for objects
interface ExerciseLog {
  name: string;
  sets: number;
  reps: number;
}

// ✅ Type for unions
type MealType = "breakfast" | "lunch" | "dinner" | "snack";
```

### Import Order

1. React/Next.js imports
2. Third-party libraries (alphabetical)
3. Local aliases (`@/components`, `@/lib`)
4. Relative imports (only when necessary)

```typescript
import * as React from "react"
import { useState } from "react"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
```

### Naming Conventions

- **Components**: PascalCase (`ExerciseLogCard`)
- **Files**: kebab-case (`exercise-log-card.tsx`)
- **Hooks**: camelCase starting with `use` (`useExerciseData`)
- **Constants**: UPPER_SNAKE_CASE for true constants
- **Variables/Functions**: camelCase
- **Zod schemas**: camelCase with `Schema` suffix (`exerciseLogSchema`)

### Component Patterns

- Use functional components with hooks
- Named exports for components
- Props interface named `{ComponentName}Props`
- Use `"use client"` only when using client-side features

```typescript
"use client";

interface ExerciseCardProps {
  name: string;
  sets: number;
  reps: number;
}

export function ExerciseCard({ name, sets, reps }: ExerciseCardProps) {
  return <div>...</div>;
}
```

### Tambo Components

Always define Zod schema and register in config:

```typescript
// components/tambo/butler/exercise-log-card.tsx
import { z } from "zod";

export const exerciseLogCardSchema = z.object({
  exerciseName: z.string(),
  sets: z.number(),
  reps: z.number(),
  weight: z.number().optional(),
});

export function ExerciseLogCard({ 
  exerciseName, sets, reps, weight 
}: z.infer<typeof exerciseLogCardSchema>) {
  // Implementation
}

// Register in lib/tambo/butler-config.ts
export const butlerComponents = [
  {
    name: "ExerciseLogCard",
    description: "Displays logged exercise",
    component: ExerciseLogCard,
    propsSchema: exerciseLogCardSchema,
  },
];
```

### Convex Patterns

```typescript
// Schema with indexes
exerciseLogs: defineTable({
  date: v.string(),
  exerciseName: v.string(),
}).index("by_date", ["date"]),

// Mutation with typed args
export const logExercise = mutation({
  args: {
    exerciseName: v.string(),
    sets: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("exerciseLogs", {
      ...args,
      createdAt: new Date().toISOString(),
    });
  },
});
```

### Styling (Tailwind CSS)

- Mobile-first responsive design
- Use `cn()` utility for conditional classes
- Never use inline styles

```tsx
// ✅ Good
<div className={cn("flex flex-col gap-4 p-4 md:flex-row", className)}>

// ❌ Avoid
<div style={{ display: 'flex', padding: '16px' }}>
```

### Error Handling

- Use try/catch for async operations
- Return early for error cases
- Use Convex's built-in error handling

```typescript
export const fetchData = query({
  handler: async (ctx) => {
    try {
      const data = await ctx.db.query("table").collect();
      return data;
    } catch (error) {
      console.error("Failed to fetch data:", error);
      throw new Error("Failed to fetch data");
    }
  },
});
```

## Project Structure

```
app/                    # Next.js App Router
components/             # React components
  ui/                   # shadcn/ui components
  tambo/                # Tambo AI components
    butler/             # Butler agent components
    trainer/            # Trainer agent components
  dashboard/            # Dashboard widgets
  layout/               # Navigation, sidebar
  onboarding/           # First-time setup
convex/                 # Convex backend
  schema.ts             # Database schema
lib/                    # Utilities and configs
  tambo/                # Tambo configurations
  utils.ts              # Helper functions
providers/              # Context providers
```

## Key Conventions

- Use `@/*` alias for imports from `src/`
- Single-user app (no auth)
- Store timestamps as ISO strings
- Use shadcn/ui components when available
- Keep components under 200 lines when possible

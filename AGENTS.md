# AGENTS.md - AI Coding Agent Instructions

## Project Overview

**FitTrack** - An AI-powered gym report tracker built with Tambo for generative UI.

This is a single-user fitness tracking application featuring:
- Two AI agents (Butler for logging, Trainer for advice)
- Exercise tracking with ExerciseDB API integration
- Meal logging with automatic nutrition estimation
- Dashboard with progress visualization

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 14 | React framework (App Router) |
| Tambo React SDK | Generative UI with AI agents |
| Convex | Real-time database |
| Tailwind CSS | Styling |
| shadcn/ui | UI components |
| Recharts | Charts and visualization |
| ExerciseDB API | Exercise data (via RapidAPI MCP) |

## Project Structure

```
/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Dashboard
│   ├── butler/             # Butler agent chat
│   ├── trainer/            # Trainer agent chat
│   └── settings/           # User settings
├── components/
│   ├── onboarding/         # First-time user setup
│   ├── tambo/              # Tambo-registered AI components
│   │   ├── butler/         # Butler-specific components
│   │   └── trainer/        # Trainer-specific components
│   ├── dashboard/          # Dashboard widgets
│   ├── layout/             # Navigation, sidebar, header
│   └── ui/                 # shadcn/ui components
├── convex/                 # Convex backend
│   ├── schema.ts           # Database schema
│   └── *.ts                # Mutations and queries
├── lib/
│   ├── tambo/              # Tambo configuration
│   └── utils.ts            # Utility functions
├── hooks/                  # Custom React hooks
├── providers/              # Context providers
└── docs/                   # Documentation
    └── PRD.md              # Product requirements
```

## Code Conventions

### TypeScript

- Use TypeScript for all files
- Prefer `interface` over `type` for object shapes
- Use strict mode
- Export types from dedicated files when shared

```typescript
// ✅ Good
interface Exercise {
  name: string;
  sets: number;
  reps: number;
}

// ❌ Avoid
type Exercise = {
  name: string;
  sets: number;
  reps: number;
}
```

### React Components

- Use functional components with hooks
- Use named exports for components
- Colocate component-specific types
- Use `"use client"` directive only when necessary

```typescript
// ✅ Good
"use client";

interface ExerciseCardProps {
  name: string;
  sets: number;
  reps: number;
}

export function ExerciseCard({ name, sets, reps }: ExerciseCardProps) {
  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-semibold">{name}</h3>
      <p>{sets} sets × {reps} reps</p>
    </div>
  );
}
```

### Tambo Components

When creating Tambo-registered components:

1. Define Zod schema for props
2. Create the React component
3. Register in the appropriate config file

```typescript
// components/tambo/butler/exercise-log-card.tsx
import { z } from "zod";

export const exerciseLogCardSchema = z.object({
  exerciseName: z.string(),
  sets: z.number(),
  reps: z.number(),
  weight: z.number().optional(),
  date: z.string(),
});

export function ExerciseLogCard({ 
  exerciseName, 
  sets, 
  reps, 
  weight, 
  date 
}: z.infer<typeof exerciseLogCardSchema>) {
  // Component implementation
}

// lib/tambo/butler-config.ts
export const butlerComponents: TamboComponent[] = [
  {
    name: "ExerciseLogCard",
    description: "Displays a logged exercise with sets, reps, and weight",
    component: ExerciseLogCard,
    propsSchema: exerciseLogCardSchema,
  },
];
```

### Convex

- Define schema in `convex/schema.ts`
- Use descriptive function names
- Add indexes for frequently queried fields

```typescript
// convex/schema.ts
export default defineSchema({
  exerciseLogs: defineTable({
    date: v.string(),
    exerciseName: v.string(),
    sets: v.number(),
    reps: v.number(),
    weight: v.optional(v.number()),
  }).index("by_date", ["date"]),
});

// convex/exerciseLogs.ts
export const logExercise = mutation({
  args: {
    exerciseName: v.string(),
    sets: v.number(),
    reps: v.number(),
    weight: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Implementation
  },
});
```

### Styling

- Use Tailwind CSS utility classes
- Follow mobile-first responsive design
- Use shadcn/ui components when available
- Use CSS variables for theming (defined in globals.css)

```tsx
// ✅ Good - Tailwind utilities
<div className="flex flex-col gap-4 p-4 md:flex-row md:p-6">

// ❌ Avoid - Inline styles
<div style={{ display: 'flex', padding: '16px' }}>
```

## Environment Variables

Required environment variables:

```env
# Tambo AI (two separate projects)
NEXT_PUBLIC_TAMBO_BUTLER_API_KEY=    # Butler agent (GPT-4o-mini)
NEXT_PUBLIC_TAMBO_TRAINER_API_KEY=   # Trainer agent (GPT-4/Claude)

# ExerciseDB API
EXERCISEDB_API_KEY=                  # RapidAPI key

# Convex
NEXT_PUBLIC_CONVEX_URL=              # Convex deployment URL
```

## Two-Agent Architecture

### Butler Agent
- **Model**: GPT-4o-mini (cost-effective)
- **Purpose**: Daily tracking and data entry
- **Tasks**: Log exercises, log meals, suggest exercises, show progress

### Trainer Agent
- **Model**: GPT-4 or Claude (high intelligence)
- **Purpose**: Expert fitness advice
- **Tasks**: Form corrections, workout planning, progress analysis

Each agent has its own:
- Tambo project with different model configuration
- Set of registered components
- Set of tools
- Custom instructions (system prompt)

## Key Files Reference

| File | Purpose |
|------|---------|
| `lib/tambo/butler-config.ts` | Butler components and tools |
| `lib/tambo/trainer-config.ts` | Trainer components and tools |
| `providers/tambo-providers.tsx` | Dual TamboProvider setup |
| `convex/schema.ts` | Database schema |
| `components/onboarding/onboarding-dialog.tsx` | First-time setup |

## Common Tasks

### Adding a New Tambo Component

1. Create component in `components/tambo/{agent}/`
2. Define Zod schema for props
3. Add to component array in `lib/tambo/{agent}-config.ts`

### Adding a New Convex Table

1. Add table definition to `convex/schema.ts`
2. Create mutations/queries in `convex/{tableName}.ts`
3. Run `npx convex dev` to sync schema

### Adding a New Tambo Tool

1. Define tool with `defineTool()` in `lib/tambo/{agent}-config.ts`
2. Implement the tool function (calls Convex or external API)
3. Add to tools array in provider config

## Testing Locally

```bash
# Install dependencies
npm install

# Start Convex dev server
npx convex dev

# Start Next.js dev server
npm run dev
```

## Important Notes

- This is a **single-user** application (no authentication)
- User profile is stored in Convex, checked via localStorage flag
- ExerciseDB API is accessed via MCP (Model Context Protocol)
- Nutrition values are AI-estimated, not from a nutrition database

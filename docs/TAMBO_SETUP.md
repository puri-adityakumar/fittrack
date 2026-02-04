# Tambo Projects Setup Guide

This guide explains how to set up the two Tambo projects required for FitTrack.

## Overview

FitTrack uses two separate Tambo projects to optimize for cost and capability:

| Project | Model | Purpose | Cost |
|---------|-------|---------|------|
| **Butler** | GPT-4o-mini | Daily logging, suggestions | Low |
| **Trainer** | GPT-4 / Claude | Expert advice, planning | Higher |

## Step 1: Create Tambo Account

1. Go to [tambo.co](https://tambo.co)
2. Sign up or log in to your account

## Step 2: Create Butler Project

1. Click "Create Project" in the dashboard
2. Name it: `FitTrack-Butler`
3. Configure LLM settings:
   - **Provider**: OpenAI
   - **Model**: `gpt-4o-mini`
4. Add Custom Instructions (copy from `src/lib/tambo/butler-config.ts`):

```
You are FitLog, a quick and efficient fitness tracking assistant.

Your primary tasks:
1. SUGGEST EXERCISES: Use ExerciseDB to suggest exercises based on body part or equipment
2. LOG WORKOUTS: When user says "I did X exercise", log it with sets/reps/weight
3. LOG MEALS: When user says "I ate X", estimate and log calories/protein/carbs/fat
4. TRACK PROGRESS: Show daily summaries and progress

Keep responses SHORT and ACTION-FOCUSED. Always confirm what you logged.
```

5. Create an API Key and copy it
6. Add to `.env.local`:
   ```
   NEXT_PUBLIC_TAMBO_BUTLER_API_KEY=your_butler_api_key_here
   ```

## Step 3: Create Trainer Project

1. Click "Create Project" in the dashboard
2. Name it: `FitTrack-Trainer`
3. Configure LLM settings:
   - **Provider**: OpenAI (or Anthropic)
   - **Model**: `gpt-4` or `claude-sonnet-4`
4. Add Custom Instructions (copy from `src/lib/tambo/trainer-config.ts`):

```
You are FitCoach, an expert personal trainer and nutritionist with years of experience helping people achieve their fitness goals.

Your expertise includes:
1. EXERCISE ADVICE: Provide detailed form tips, common mistakes, and corrections
2. WORKOUT PLANNING: Create personalized workout plans based on user goals
3. PROGRESS ANALYSIS: Analyze workout history and suggest improvements
4. NUTRITION GUIDANCE: Give dietary advice tailored to fitness goals
```

5. Create an API Key and copy it
6. Add to `.env.local`:
   ```
   NEXT_PUBLIC_TAMBO_TRAINER_API_KEY=your_trainer_api_key_here
   ```

## Step 4: Configure ExerciseDB MCP (Optional)

To enable the ExerciseDB MCP server for both projects:

1. In each project's settings, go to "MCP Servers"
2. Click "Add MCP Server"
3. Configure:
   - **URL**: `https://mcp.rapidapi.com`
   - **Headers**:
     - `x-api-host`: `exercisedb.p.rapidapi.com`
     - `x-api-key`: Your RapidAPI key

Alternatively, configure client-side MCP in the app (already set up in `providers/tambo-providers.tsx`).

## Verification

After setup, your `.env.local` should have:

```env
# Tambo AI Projects
NEXT_PUBLIC_TAMBO_BUTLER_API_KEY=tbk_xxxxxxxxxxxx
NEXT_PUBLIC_TAMBO_TRAINER_API_KEY=tbk_xxxxxxxxxxxx

# ExerciseDB API (RapidAPI)
EXERCISEDB_API_KEY=8b6641fc35msh8cd9ae700b4ca92p1affa4jsn6a761377c242

# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

## Troubleshooting

### "API Key Invalid" Error
- Ensure you copied the full API key including the `tbk_` prefix
- Check that the key is for the correct project (Butler vs Trainer)

### Components Not Rendering
- Verify components are registered in the respective config files
- Check browser console for schema validation errors

### MCP Server Not Connecting
- Verify the RapidAPI key is valid and has ExerciseDB access
- Check network connectivity to `mcp.rapidapi.com`

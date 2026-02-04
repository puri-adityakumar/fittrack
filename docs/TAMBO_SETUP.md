# Tambo Projects Setup Guide

This guide explains how to set up the two Tambo projects required for FitTrack.

## Overview

FitTrack uses a single Tambo project with two distinct system prompts:

- **Butler Prompt**: quick logging and daily tracking
- **Trainer Prompt**: expert advice and planning

Because this is a single project, **both prompts use the same model**. Choose a model that fits your preference for cost vs. quality.

## Step 1: Create Tambo Account

1. Go to [tambo.co](https://tambo.co)
2. Sign up or log in to your account

## Step 2: Create a Tambo Project

1. Click "Create Project" in the dashboard
2. Name it: `FitTrack`
3. Configure LLM settings:
   - **Provider**: OpenAI (or Anthropic)
   - **Model**: Choose one model (single project)
4. Create an API Key and copy it
5. Add to `.env.local`:
   ```
   NEXT_PUBLIC_TAMBO_API_KEY=your_api_key_here
   ```

## Step 3: Configure Prompts in the App

The app seeds each thread with a hidden system prompt:

- **Butler Prompt**: `src/lib/tambo/butler-config.ts`
- **Trainer Prompt**: `src/lib/tambo/trainer-config.ts`

No additional Tambo dashboard configuration is required for these prompts.

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
# Tambo AI Project
NEXT_PUBLIC_TAMBO_API_KEY=tbk_xxxxxxxxxxxx

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

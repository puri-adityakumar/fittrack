"use client";

import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, Flame, Target } from "lucide-react";

export const dailyProgressCardSchema = z.object({
  date: z.string().optional().describe("Date for the progress"),
  exerciseCount: z.number().optional().describe("Number of exercises completed"),
  totalCalories: z.number().optional().describe("Total calories consumed"),
  totalProtein: z.number().optional().describe("Total protein in grams"),
  totalCarbs: z.number().optional().describe("Total carbs in grams"),
  totalFat: z.number().optional().describe("Total fat in grams"),
  calorieTarget: z.number().optional().describe("Daily calorie target"),
});

type DailyProgressCardProps = z.infer<typeof dailyProgressCardSchema>;

export function DailyProgressCard({
  date,
  exerciseCount,
  totalCalories,
  totalProtein,
  totalCarbs,
  totalFat,
  calorieTarget,
}: DailyProgressCardProps) {
  const resolvedDate = date ?? new Date().toISOString().split("T")[0];
  const resolvedExerciseCount = exerciseCount ?? 0;
  const resolvedTotalCalories = totalCalories ?? 0;
  const resolvedTotalProtein = totalProtein ?? 0;
  const resolvedTotalCarbs = totalCarbs ?? 0;
  const resolvedTotalFat = totalFat ?? 0;
  const resolvedCalorieTarget = calorieTarget ?? 2000;
  
  const calorieProgress = resolvedCalorieTarget > 0 
    ? Math.min((resolvedTotalCalories / resolvedCalorieTarget) * 100, 100) 
    : 0;
  const caloriesRemaining = Math.max(resolvedCalorieTarget - resolvedTotalCalories, 0);

  const formatDate = (dateStr: string) => {
    const today = new Date().toISOString().split("T")[0];
    if (dateStr === today) return "Today's Progress";
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          {formatDate(resolvedDate)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Exercise Count */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            <span className="font-medium">Exercises</span>
          </div>
          <span className="text-2xl font-bold">{resolvedExerciseCount}</span>
        </div>

        {/* Calorie Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="font-medium">Calories</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {resolvedTotalCalories} / {resolvedCalorieTarget}
            </span>
          </div>
          <Progress value={calorieProgress} className="h-3" />
          <p className="text-xs text-muted-foreground text-right">
            {caloriesRemaining > 0
              ? `${caloriesRemaining} cal remaining`
              : "Target reached!"}
          </p>
        </div>

        {/* Macros */}
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center p-2 bg-blue-50 dark:bg-blue-950 rounded-md">
            <span className="text-lg font-semibold text-blue-600">
              {resolvedTotalProtein}g
            </span>
            <span className="text-xs text-muted-foreground">Protein</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-amber-50 dark:bg-amber-950 rounded-md">
            <span className="text-lg font-semibold text-amber-600">
              {resolvedTotalCarbs}g
            </span>
            <span className="text-xs text-muted-foreground">Carbs</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-red-50 dark:bg-red-950 rounded-md">
            <span className="text-lg font-semibold text-red-600">
              {resolvedTotalFat}g
            </span>
            <span className="text-xs text-muted-foreground">Fat</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

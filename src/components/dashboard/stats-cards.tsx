"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, Flame, TrendingUp, Target } from "lucide-react";

interface StatsCardsProps {
  exerciseCount: number;
  totalCalories: number;
  calorieTarget: number;
  totalProtein: number;
  streak: number;
}

export function StatsCards({
  exerciseCount,
  totalCalories,
  calorieTarget,
  totalProtein,
  streak,
}: StatsCardsProps) {
  const calorieProgress = Math.min((totalCalories / calorieTarget) * 100, 100);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Exercises Today */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Exercises</CardTitle>
          <Dumbbell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{exerciseCount}</div>
          <p className="text-xs text-muted-foreground">completed today</p>
        </CardContent>
      </Card>

      {/* Calories */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Calories</CardTitle>
          <Flame className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCalories}</div>
          <Progress value={calorieProgress} className="mt-2 h-2" />
          <p className="text-xs text-muted-foreground mt-1">
            of {calorieTarget} target
          </p>
        </CardContent>
      </Card>

      {/* Protein */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Protein</CardTitle>
          <TrendingUp className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProtein}g</div>
          <p className="text-xs text-muted-foreground">consumed today</p>
        </CardContent>
      </Card>

      {/* Streak */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Streak</CardTitle>
          <Target className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{streak}</div>
          <p className="text-xs text-muted-foreground">days in a row</p>
        </CardContent>
      </Card>
    </div>
  );
}

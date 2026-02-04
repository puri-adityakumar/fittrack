"use client";

import { useState, useEffect } from "react";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { CalorieChart } from "@/components/dashboard/calorie-chart";
import { ExerciseHistory } from "@/components/dashboard/exercise-history";
import { WeeklyOverview } from "@/components/dashboard/weekly-overview";
import { ExerciseLogTable } from "@/components/dashboard/exercise-log-table";
import { MealLogTable } from "@/components/dashboard/meal-log-table";
import { OnboardingDialog } from "@/components/onboarding/onboarding-dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare, Dumbbell } from "lucide-react";
import Link from "next/link";

// Mock data for demonstration (will be replaced with Convex queries)
const mockWeeklyData = [
  { date: "2026-01-29", calories: 1850, protein: 120, exerciseCount: 3 },
  { date: "2026-01-30", calories: 2100, protein: 140, exerciseCount: 4 },
  { date: "2026-01-31", calories: 1950, protein: 130, exerciseCount: 2 },
  { date: "2026-02-01", calories: 2200, protein: 150, exerciseCount: 5 },
  { date: "2026-02-02", calories: 1800, protein: 110, exerciseCount: 3 },
  { date: "2026-02-03", calories: 2050, protein: 135, exerciseCount: 4 },
  { date: "2026-02-04", calories: 800, protein: 55, exerciseCount: 2 },
];

const mockExercises = [
  {
    id: "1",
    exerciseName: "Bench Press",
    sets: 3,
    reps: 10,
    weight: 60,
    date: "2026-02-04",
  },
  {
    id: "2",
    exerciseName: "Squats",
    sets: 4,
    reps: 8,
    weight: 80,
    date: "2026-02-04",
  },
  {
    id: "3",
    exerciseName: "Deadlift",
    sets: 3,
    reps: 6,
    weight: 100,
    date: "2026-02-03",
  },
  {
    id: "4",
    exerciseName: "Shoulder Press",
    sets: 3,
    reps: 12,
    weight: 30,
    date: "2026-02-03",
  },
];

export default function DashboardPage() {
  const [todayStats, setTodayStats] = useState({
    exerciseCount: 2,
    totalCalories: 800,
    calorieTarget: 2000,
    totalProtein: 55,
    streak: 5,
  });

  // Get today's data from the weekly data
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayData = mockWeeklyData.find((d) => d.date === today);
    if (todayData) {
      setTodayStats((prev) => ({
        ...prev,
        exerciseCount: todayData.exerciseCount,
        totalCalories: todayData.calories,
        totalProtein: todayData.protein,
      }));
    }
  }, []);

  return (
    <>
      <OnboardingDialog />
      <div className="container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Track your fitness journey
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/butler">
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Butler
              </Button>
            </Link>
            <Link href="/trainer">
              <Button className="gap-2">
                <Dumbbell className="h-4 w-4" />
                Trainer
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <StatsCards {...todayStats} />

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <CalorieChart data={mockWeeklyData} calorieTarget={2000} />
          <WeeklyOverview data={mockWeeklyData} />
        </div>

        {/* Exercise History */}
        <div className="mt-6">
          <ExerciseHistory exercises={mockExercises} />
        </div>

        {/* Daily Logs Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <ExerciseLogTable />
          <MealLogTable />
        </div>
      </div>
    </>
  );
}

"use client";

import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Calendar, Weight } from "lucide-react";

export const exerciseLogCardSchema = z.object({
  exerciseName: z.string().optional().describe("Name of the exercise"),
  sets: z.number().optional().describe("Number of sets"),
  reps: z.number().optional().describe("Number of reps per set"),
  weight: z.number().optional().describe("Weight in kg"),
  duration: z.number().optional().describe("Duration in minutes"),
  date: z.string().optional().describe("Date of the exercise"),
  notes: z.string().optional().describe("Additional notes"),
});

type ExerciseLogCardProps = z.infer<typeof exerciseLogCardSchema>;

export function ExerciseLogCard({
  exerciseName,
  sets,
  reps,
  weight,
  duration,
  date,
  notes,
}: ExerciseLogCardProps) {
  const resolvedName = exerciseName ?? "Exercise";
  const resolvedDate = date ?? new Date().toISOString().split("T")[0];
  const resolvedSets = sets ?? 3;
  const resolvedReps = reps ?? 10;
  const formatDate = (dateStr: string) => {
    const today = new Date().toISOString().split("T")[0];
    if (dateStr === today) return "Today";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Dumbbell className="h-5 w-5 text-primary" />
            {resolvedName}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            {formatDate(resolvedDate)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex flex-col items-center p-2 bg-muted rounded-md">
            <span className="text-2xl font-bold text-primary">{resolvedSets}</span>
            <span className="text-xs text-muted-foreground">sets</span>
          </div>
          <span className="text-muted-foreground">×</span>
          <div className="flex flex-col items-center p-2 bg-muted rounded-md">
            <span className="text-2xl font-bold text-primary">{resolvedReps}</span>
            <span className="text-xs text-muted-foreground">reps</span>
          </div>
          {weight && (
            <>
              <span className="text-muted-foreground">@</span>
              <div className="flex flex-col items-center p-2 bg-muted rounded-md">
                <span className="text-2xl font-bold text-primary flex items-center">
                  {weight}
                  <Weight className="h-4 w-4 ml-1" />
                </span>
                <span className="text-xs text-muted-foreground">kg</span>
              </div>
            </>
          )}
          {duration && (
            <div className="flex flex-col items-center p-2 bg-muted rounded-md">
              <span className="text-2xl font-bold text-primary">{duration}</span>
              <span className="text-xs text-muted-foreground">min</span>
            </div>
          )}
        </div>
        {notes && (
          <p className="mt-3 text-sm text-muted-foreground italic">{notes}</p>
        )}
      </CardContent>
    </Card>
  );
}

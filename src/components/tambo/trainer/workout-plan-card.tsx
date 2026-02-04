"use client";

import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Clock, Dumbbell } from "lucide-react";

const exerciseInPlanSchema = z.object({
  name: z.string().describe("Exercise name"),
  sets: z.number().describe("Number of sets"),
  reps: z.number().describe("Number of reps"),
  restSeconds: z.number().describe("Rest time between sets in seconds"),
  notes: z.string().optional().describe("Additional notes for this exercise"),
});

export const workoutPlanCardSchema = z.object({
  planName: z.string().describe("Name of the workout plan"),
  description: z.string().optional().describe("Description of the plan"),
  targetGoal: z.string().optional().describe("Target fitness goal"),
  estimatedDuration: z.number().optional().describe("Estimated workout duration in minutes"),
  exercises: z.array(exerciseInPlanSchema).describe("List of exercises in the plan"),
});

type WorkoutPlanCardProps = z.infer<typeof workoutPlanCardSchema>;

export function WorkoutPlanCard({
  planName,
  description,
  targetGoal,
  estimatedDuration,
  exercises,
}: WorkoutPlanCardProps) {
  const totalSets = exercises.reduce((acc, ex) => acc + ex.sets, 0);

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-primary" />
          {planName}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
        <div className="flex flex-wrap gap-2 mt-2">
          {targetGoal && (
            <Badge variant="default" className="text-xs">
              {targetGoal}
            </Badge>
          )}
          {estimatedDuration && (
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {estimatedDuration} min
            </Badge>
          )}
          <Badge variant="outline" className="text-xs">
            <Dumbbell className="h-3 w-3 mr-1" />
            {exercises.length} exercises • {totalSets} sets
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {exercises.map((exercise, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-muted rounded-lg"
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-sm capitalize">{exercise.name}</p>
                  {exercise.notes && (
                    <p className="text-xs text-muted-foreground">{exercise.notes}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {exercise.sets} × {exercise.reps}
                </p>
                <p className="text-xs text-muted-foreground">
                  {exercise.restSeconds}s rest
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Target } from "lucide-react";

const exerciseSchema = z.object({
  id: z.string().optional().describe("Exercise ID from ExerciseDB"),
  name: z.string().describe("Exercise name"),
  bodyPart: z.string().optional().describe("Target body part"),
  equipment: z.string().optional().describe("Required equipment"),
  gifUrl: z.string().optional().describe("GIF URL showing the exercise"),
  instructions: z.array(z.string()).optional().describe("Exercise instructions"),
});

export const exerciseSuggestionListSchema = z.object({
  title: z.string().optional().describe("Title for the suggestion list"),
  bodyPart: z.string().optional().describe("Body part filter used"),
  equipment: z.string().optional().describe("Equipment filter used"),
  exercises: z.array(exerciseSchema).describe("List of suggested exercises"),
});

type ExerciseSuggestionListProps = z.infer<typeof exerciseSuggestionListSchema>;

export function ExerciseSuggestionList({
  title,
  bodyPart,
  equipment,
  exercises,
}: ExerciseSuggestionListProps) {
  const resolvedTitle =
    title ||
    (bodyPart || equipment
      ? `Exercises for ${[bodyPart, equipment].filter(Boolean).join(" · ")}`
      : "Exercise Suggestions");

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-primary" />
          {resolvedTitle}
        </CardTitle>
        <div className="flex gap-2 mt-2">
          {bodyPart && (
            <Badge variant="outline" className="text-xs">
              <Target className="h-3 w-3 mr-1" />
              {bodyPart}
            </Badge>
          )}
          {equipment && (
            <Badge variant="outline" className="text-xs">
              {equipment}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {exercises.map((exercise, index) => (
            <li
              key={exercise.id || index}
              className="flex items-start gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              {exercise.gifUrl ? (
                <img
                  src={exercise.gifUrl}
                  alt={exercise.name}
                  className="w-16 h-16 rounded object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded bg-primary/10 flex items-center justify-center">
                  <Dumbbell className="h-6 w-6 text-primary" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm capitalize">
                  {exercise.name}
                </h4>
                <div className="flex gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {exercise.bodyPart || "Other"}
                  </Badge>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {exercise.equipment || "Bodyweight"}
                  </Badge>
                </div>
                {exercise.instructions && exercise.instructions.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {exercise.instructions[0]}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
        {exercises.length === 0 && (
          <p className="text-center text-muted-foreground py-4">
            No exercises found. Try different filters.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

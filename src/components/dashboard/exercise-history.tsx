"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, Calendar } from "lucide-react";

interface ExerciseLog {
  id: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weight?: number;
  date: string;
}

interface ExerciseHistoryProps {
  exercises: ExerciseLog[];
}

export function ExerciseHistory({ exercises }: ExerciseHistoryProps) {
  const formatDate = (dateStr: string) => {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

    if (dateStr === today) return "Today";
    if (dateStr === yesterday) return "Yesterday";

    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Group exercises by date
  const groupedExercises = exercises.reduce(
    (acc, exercise) => {
      const date = exercise.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(exercise);
      return acc;
    },
    {} as Record<string, ExerciseLog[]>
  );

  const sortedDates = Object.keys(groupedExercises).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5" />
          Recent Exercises
        </CardTitle>
      </CardHeader>
      <CardContent>
        {exercises.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Dumbbell className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No exercises logged yet</p>
            <p className="text-sm">Start tracking with the Butler agent!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedDates.map((date) => (
              <div key={date}>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{formatDate(date)}</span>
                </div>
                <div className="space-y-2 ml-6">
                  {groupedExercises[date].map((exercise) => (
                    <div
                      key={exercise.id}
                      className="flex items-center justify-between p-2 bg-muted rounded-md"
                    >
                      <span className="text-sm font-medium capitalize">
                        {exercise.exerciseName}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {exercise.sets}×{exercise.reps}
                        </Badge>
                        {exercise.weight && (
                          <Badge variant="outline" className="text-xs">
                            {exercise.weight}kg
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

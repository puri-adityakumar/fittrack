"use client";

import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Lightbulb, Dumbbell } from "lucide-react";

export const exerciseAdviceCardSchema = z.object({
  exerciseName: z.string().optional().describe("Name of the exercise"),
  targetMuscles: z.array(z.string()).optional().describe("Primary muscles targeted"),
  formTips: z.array(z.string()).optional().describe("Tips for proper form"),
  commonMistakes: z.array(z.string()).optional().describe("Common mistakes to avoid"),
  variations: z.array(z.string()).optional().describe("Exercise variations for different levels"),
  safetyNotes: z.string().optional().describe("Important safety considerations"),
});

type ExerciseAdviceCardProps = z.infer<typeof exerciseAdviceCardSchema>;

export function ExerciseAdviceCard({
  exerciseName,
  targetMuscles,
  formTips,
  commonMistakes,
  variations,
  safetyNotes,
}: ExerciseAdviceCardProps) {
  const resolvedName = exerciseName ?? "Exercise";
  const resolvedTargetMuscles = targetMuscles ?? [];
  const resolvedFormTips = formTips ?? [];
  const resolvedCommonMistakes = commonMistakes ?? [];

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-primary" />
          {resolvedName}
        </CardTitle>
        <div className="flex flex-wrap gap-2 mt-2">
          {resolvedTargetMuscles.map((muscle, index) => (
            <Badge key={index} variant="secondary" className="text-xs capitalize">
              {muscle}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Form Tips */}
        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2 text-green-600">
            <CheckCircle className="h-4 w-4" />
            Proper Form
          </h4>
          <ul className="space-y-1 ml-6">
            {resolvedFormTips.map((tip, index) => (
              <li key={index} className="text-sm text-muted-foreground list-disc">
                {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Common Mistakes */}
        <div className="space-y-2">
          <h4 className="font-medium flex items-center gap-2 text-red-600">
            <AlertCircle className="h-4 w-4" />
            Common Mistakes
          </h4>
          <ul className="space-y-1 ml-6">
            {resolvedCommonMistakes.map((mistake, index) => (
              <li key={index} className="text-sm text-muted-foreground list-disc">
                {mistake}
              </li>
            ))}
          </ul>
        </div>

        {/* Variations */}
        {variations && variations.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium flex items-center gap-2 text-blue-600">
              <Lightbulb className="h-4 w-4" />
              Variations
            </h4>
            <ul className="space-y-1 ml-6">
              {variations.map((variation, index) => (
                <li key={index} className="text-sm text-muted-foreground list-disc">
                  {variation}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Safety Notes */}
        {safetyNotes && (
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Safety:</strong> {safetyNotes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

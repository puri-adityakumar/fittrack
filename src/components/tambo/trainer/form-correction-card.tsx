"use client";

import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";

const correctionItemSchema = z.object({
  issue: z.string().optional().describe("The form issue to correct"),
  correction: z.string().optional().describe("How to correct the issue"),
  importance: z.enum(["critical", "important", "minor"]).optional().describe("Importance level"),
});

export const formCorrectionCardSchema = z.object({
  exerciseName: z.string().optional().describe("Name of the exercise"),
  overallAssessment: z.string().optional().describe("Overall assessment of the user's form"),
  corrections: z.array(correctionItemSchema).optional().describe("List of form corrections"),
  doList: z.array(z.string()).optional().describe("Things to do correctly"),
  dontList: z.array(z.string()).optional().describe("Things to avoid"),
});

type FormCorrectionCardProps = z.infer<typeof formCorrectionCardSchema>;

const importanceColors = {
  critical: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
  important: "bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-200",
  minor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
};

const importanceIcons = {
  critical: <AlertTriangle className="h-4 w-4 text-red-600" />,
  important: <AlertTriangle className="h-4 w-4 text-yellow-600" />,
  minor: <AlertTriangle className="h-4 w-4 text-blue-600" />,
};

export function FormCorrectionCard({
  exerciseName,
  overallAssessment,
  corrections,
  doList,
  dontList,
}: FormCorrectionCardProps) {
  const resolvedExerciseName = exerciseName ?? "Exercise";
  const resolvedAssessment = overallAssessment ?? "Form review";
  const resolvedCorrections = corrections ?? [];
  const resolvedDoList = doList ?? [];
  const resolvedDontList = dontList ?? [];

  return (
    <Card className="w-full max-w-lg">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Form Check: {resolvedExerciseName}</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">{resolvedAssessment}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Corrections */}
        {resolvedCorrections.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Corrections Needed</h4>
            <div className="space-y-2">
              {resolvedCorrections.map((correction, index) => {
                const importance = correction.importance ?? "important";
                return (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${importanceColors[importance]}`}
                  >
                    <div className="flex items-start gap-2">
                      {importanceIcons[importance]}
                      <div>
                        <p className="font-medium text-sm">{correction.issue ?? "Form issue"}</p>
                        <p className="text-sm mt-1">{correction.correction ?? "Correction needed"}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Do's and Don'ts */}
        <div className="grid grid-cols-2 gap-4">
          {/* Do's */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-1 text-green-600">
              <CheckCircle className="h-4 w-4" />
              Do
            </h4>
            <ul className="space-y-1">
              {resolvedDoList.map((item, index) => (
                <li
                  key={index}
                  className="text-xs text-muted-foreground flex items-start gap-1"
                >
                  <span className="text-green-500 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Don'ts */}
          <div className="space-y-2">
            <h4 className="font-medium text-sm flex items-center gap-1 text-red-600">
              <XCircle className="h-4 w-4" />
              Don&apos;t
            </h4>
            <ul className="space-y-1">
              {resolvedDontList.map((item, index) => (
                <li
                  key={index}
                  className="text-xs text-muted-foreground flex items-start gap-1"
                >
                  <span className="text-red-500 mt-0.5">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

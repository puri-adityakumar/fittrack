"use client";

import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Utensils, Flame } from "lucide-react";

export const mealLogCardSchema = z.object({
  foodName: z.string().describe("Name/description of the food"),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]).describe("Type of meal"),
  quantity: z.string().optional().describe("Quantity description"),
  calories: z.number().describe("Calories"),
  protein: z.number().describe("Protein in grams"),
  carbs: z.number().describe("Carbohydrates in grams"),
  fat: z.number().describe("Fat in grams"),
  date: z.string().describe("Date of the meal"),
});

type MealLogCardProps = z.infer<typeof mealLogCardSchema>;

const mealTypeEmoji: Record<string, string> = {
  breakfast: "🌅",
  lunch: "☀️",
  dinner: "🌙",
  snack: "🍎",
};

const mealTypeLabel: Record<string, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
  snack: "Snack",
};

export function MealLogCard({
  foodName,
  mealType,
  quantity,
  calories,
  protein,
  carbs,
  fat,
  date,
}: MealLogCardProps) {
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
            <Utensils className="h-5 w-5 text-primary" />
            {mealTypeEmoji[mealType]} {mealTypeLabel[mealType]}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {formatDate(date)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {foodName}
          {quantity && ` (${quantity})`}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-3">
          <Flame className="h-4 w-4 text-orange-500" />
          <span className="text-xl font-bold">{calories}</span>
          <span className="text-sm text-muted-foreground">calories</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center p-2 bg-blue-50 dark:bg-blue-950 rounded-md">
            <span className="text-lg font-semibold text-blue-600">{protein}g</span>
            <span className="text-xs text-muted-foreground">Protein</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-amber-50 dark:bg-amber-950 rounded-md">
            <span className="text-lg font-semibold text-amber-600">{carbs}g</span>
            <span className="text-xs text-muted-foreground">Carbs</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-red-50 dark:bg-red-950 rounded-md">
            <span className="text-lg font-semibold text-red-600">{fat}g</span>
            <span className="text-xs text-muted-foreground">Fat</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

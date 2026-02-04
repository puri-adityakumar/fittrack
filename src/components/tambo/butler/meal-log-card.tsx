"use client";

import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Utensils, Flame } from "lucide-react";

export const mealLogCardSchema = z.object({
  foodName: z.string().optional().describe("Name/description of the food"),
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]).optional().describe("Type of meal"),
  quantity: z.string().optional().describe("Quantity description"),
  calories: z.number().optional().describe("Calories"),
  protein: z.number().optional().describe("Protein in grams"),
  carbs: z.number().optional().describe("Carbohydrates in grams"),
  fat: z.number().optional().describe("Fat in grams"),
  date: z.string().optional().describe("Date of the meal"),
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
  const resolvedFoodName = foodName ?? "Meal";
  const resolvedMealType = mealType ?? "snack";
  const resolvedDate = date ?? new Date().toISOString().split("T")[0];
  const resolvedCalories = calories ?? 0;
  const resolvedProtein = protein ?? 0;
  const resolvedCarbs = carbs ?? 0;
  const resolvedFat = fat ?? 0;

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
            {mealTypeEmoji[resolvedMealType]} {mealTypeLabel[resolvedMealType]}
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            {formatDate(resolvedDate)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {resolvedFoodName}
          {quantity && ` (${quantity})`}
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-3">
          <Flame className="h-4 w-4 text-orange-500" />
          <span className="text-xl font-bold">{resolvedCalories}</span>
          <span className="text-sm text-muted-foreground">calories</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center p-2 bg-blue-50 dark:bg-blue-950 rounded-md">
            <span className="text-lg font-semibold text-blue-600">{resolvedProtein}g</span>
            <span className="text-xs text-muted-foreground">Protein</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-amber-50 dark:bg-amber-950 rounded-md">
            <span className="text-lg font-semibold text-amber-600">{resolvedCarbs}g</span>
            <span className="text-xs text-muted-foreground">Carbs</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-red-50 dark:bg-red-950 rounded-md">
            <span className="text-lg font-semibold text-red-600">{resolvedFat}g</span>
            <span className="text-xs text-muted-foreground">Fat</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Utensils } from "lucide-react";

export function MealLogTable() {
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [date, setDate] = useState(today);

  const logs = useQuery(api.mealLogs.getByDate, { date }) ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="flex items-center gap-2">
          <Utensils className="h-5 w-5" />
          Meal Log
        </CardTitle>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Date</span>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-[160px]"
          />
        </div>
      </CardHeader>
      <CardContent>
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No meals logged for this day.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 font-medium">Meal</th>
                  <th className="py-2 font-medium">Type</th>
                  <th className="py-2 font-medium">Calories</th>
                  <th className="py-2 font-medium">Macros</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id} className="border-b last:border-0">
                    <td className="py-2">
                      <div className="font-medium">{log.foodName}</div>
                      <div className="text-xs text-muted-foreground">
                        {log.quantity ?? "—"}
                      </div>
                    </td>
                    <td className="py-2 capitalize">
                      <Badge variant="secondary">{log.mealType}</Badge>
                    </td>
                    <td className="py-2">{log.calories}</td>
                    <td className="py-2 text-xs text-muted-foreground">
                      P {log.protein}g · C {log.carbs}g · F {log.fat}g
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

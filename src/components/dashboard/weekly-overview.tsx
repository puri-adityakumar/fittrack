"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface DailyData {
  date: string;
  calories: number;
  protein: number;
  exerciseCount: number;
}

interface WeeklyOverviewProps {
  data: DailyData[];
}

export function WeeklyOverview({ data }: WeeklyOverviewProps) {
  // Format data for display
  const formattedData = data.map((item) => ({
    ...item,
    displayDate: new Date(item.date).toLocaleDateString("en-US", {
      weekday: "short",
    }),
    isToday: item.date === new Date().toISOString().split("T")[0],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exercise Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="displayDate"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value) => [`${value ?? 0} exercises`, "Exercises"]}
              />
              <Bar dataKey="exerciseCount" radius={[4, 4, 0, 0]}>
                {formattedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.isToday
                        ? "hsl(var(--primary))"
                        : "hsl(var(--primary) / 0.5)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useMemo, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dumbbell } from "lucide-react";

export function ExerciseLogTable() {
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [date, setDate] = useState(today);

  const logs = useQuery(api.exerciseLogs.getByDate, { date }) ?? [];

  return (
    <Card>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5" />
          Exercise Log
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
            No exercises logged for this day.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2 font-medium">Exercise</th>
                  <th className="py-2 font-medium">Sets</th>
                  <th className="py-2 font-medium">Reps</th>
                  <th className="py-2 font-medium">Weight</th>
                  <th className="py-2 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log._id} className="border-b last:border-0">
                    <td className="py-2 capitalize">{log.exerciseName}</td>
                    <td className="py-2">{log.sets}</td>
                    <td className="py-2">{log.reps}</td>
                    <td className="py-2">
                      {log.weight ? (
                        <Badge variant="outline">{log.weight} kg</Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-2 text-muted-foreground">
                      {log.notes ?? "—"}
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

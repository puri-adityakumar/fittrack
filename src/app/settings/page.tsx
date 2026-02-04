"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useOnboarding } from "@/hooks/use-onboarding";

interface UserProfile {
  name: string;
  height: number;
  weight: number;
  age: number;
  fitnessGoal: string;
  dailyCalorieTarget: number;
}

const PROFILE_STORAGE_KEY = "fittrack_user_profile";

export default function SettingsPage() {
  const { resetOnboarding } = useOnboarding();
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    height: 170,
    weight: 70,
    age: 25,
    fitnessGoal: "maintain",
    dailyCalorieTarget: 2000,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  // Load profile from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored profile:", e);
      }
    }
  }, []);

  const calculateCalories = (goal: string, weight: number) => {
    const baseCalories = weight * 24;
    switch (goal) {
      case "lose_weight":
        return Math.round(baseCalories * 0.8);
      case "build_muscle":
        return Math.round(baseCalories * 1.2);
      default:
        return Math.round(baseCalories);
    }
  };

  const handleGoalChange = (goal: string) => {
    const suggestedCalories = calculateCalories(goal, profile.weight);
    setProfile((prev) => ({
      ...prev,
      fitnessGoal: goal,
      dailyCalorieTarget: suggestedCalories,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage("");
    try {
      // Save to localStorage (and Convex when ready)
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
      // TODO: Save to Convex when functions are ready
      // await updateUserProfile(profile);
      setSaveMessage("Settings saved successfully!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
      setSaveMessage("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    // Clear all data
    localStorage.removeItem(PROFILE_STORAGE_KEY);
    resetOnboarding();
    setShowResetDialog(false);
    // Redirect to home to trigger onboarding
    window.location.href = "/";
  };

  return (
    <div className="container max-w-2xl py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile and app preferences
        </p>
      </div>

      <div className="space-y-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal details and fitness goals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={profile.name}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  min={100}
                  max={250}
                  value={profile.height}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      height: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  min={30}
                  max={300}
                  value={profile.weight}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      weight: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min={13}
                  max={100}
                  value={profile.age}
                  onChange={(e) =>
                    setProfile((prev) => ({
                      ...prev,
                      age: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Fitness Goal</Label>
              <Select value={profile.fitnessGoal} onValueChange={handleGoalChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lose_weight">🔥 Lose Weight</SelectItem>
                  <SelectItem value="build_muscle">💪 Build Muscle</SelectItem>
                  <SelectItem value="maintain">⚖️ Maintain Weight</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="calories">Daily Calorie Target</Label>
              <Input
                id="calories"
                type="number"
                min={1000}
                max={5000}
                value={profile.dailyCalorieTarget}
                onChange={(e) =>
                  setProfile((prev) => ({
                    ...prev,
                    dailyCalorieTarget: parseInt(e.target.value) || 0,
                  }))
                }
              />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              {saveMessage && (
                <span
                  className={`text-sm ${saveMessage.includes("success")
                      ? "text-green-600"
                      : "text-red-600"
                    }`}
                >
                  {saveMessage}
                </span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions that will delete your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive">Reset All Data</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure?</DialogTitle>
                  <DialogDescription>
                    This will delete all your data including:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Your profile information</li>
                      <li>All exercise logs</li>
                      <li>All meal logs</li>
                      <li>All workout plans</li>
                    </ul>
                    <p className="mt-2 font-medium">
                      This action cannot be undone.
                    </p>
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowResetDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleReset}>
                    Yes, Reset Everything
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

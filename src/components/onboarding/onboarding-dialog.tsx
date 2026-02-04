"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useOnboarding } from "@/hooks/use-onboarding";

interface OnboardingFormData {
  name: string;
  height: number;
  weight: number;
  age: number;
  fitnessGoal: string;
  dailyCalorieTarget: number;
}

interface OnboardingDialogProps {
  onComplete?: (data: OnboardingFormData) => void;
}

export function OnboardingDialog({ onComplete }: OnboardingDialogProps) {
  const { isComplete, isLoading, completeOnboarding } = useOnboarding();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>({
    name: "",
    height: 170,
    weight: 70,
    age: 25,
    fitnessGoal: "maintain",
    dailyCalorieTarget: 2000,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate suggested calories based on goal
  const calculateCalories = (goal: string, weight: number) => {
    const baseCalories = weight * 24; // Basic BMR estimate
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
    const suggestedCalories = calculateCalories(goal, formData.weight);
    setFormData((prev) => ({
      ...prev,
      fitnessGoal: goal,
      dailyCalorieTarget: suggestedCalories,
    }));
  };

  const handleWeightChange = (weight: number) => {
    const suggestedCalories = calculateCalories(formData.fitnessGoal, weight);
    setFormData((prev) => ({
      ...prev,
      weight,
      dailyCalorieTarget: suggestedCalories,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // TODO: Save to Convex when functions are ready
      // await saveUserProfile(formData);
      
      completeOnboarding();
      onComplete?.(formData);
    } catch (error) {
      console.error("Failed to save profile:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render while loading or if already complete
  if (isLoading || isComplete) {
    return null;
  }

  return (
    <Dialog open={!isComplete} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {step === 1 && "Welcome to FitTrack! 💪"}
            {step === 2 && "Your Body Stats"}
            {step === 3 && "Your Fitness Goal"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 && "Let's set up your profile to personalize your fitness journey."}
            {step === 2 && "We'll use this to calculate your recommended daily intake."}
            {step === 3 && "Choose your primary fitness goal."}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Step 1: Name */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">What should we call you?</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Step 2: Body Stats */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    min={100}
                    max={250}
                    value={formData.height}
                    onChange={(e) =>
                      setFormData((prev) => ({
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
                    value={formData.weight}
                    onChange={(e) =>
                      handleWeightChange(parseInt(e.target.value) || 0)
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min={13}
                  max={100}
                  value={formData.age}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      age: parseInt(e.target.value) || 0,
                    }))
                  }
                />
              </div>
            </div>
          )}

          {/* Step 3: Fitness Goal */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="goal">Primary Goal</Label>
                <Select
                  value={formData.fitnessGoal}
                  onValueChange={handleGoalChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your goal" />
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
                  value={formData.dailyCalorieTarget}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dailyCalorieTarget: parseInt(e.target.value) || 0,
                    }))
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Suggested based on your weight and goal. You can adjust this anytime.
                </p>
              </div>

              {/* Summary */}
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <h4 className="font-medium mb-2">Your Profile Summary</h4>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>Name: {formData.name}</li>
                  <li>Height: {formData.height} cm</li>
                  <li>Weight: {formData.weight} kg</li>
                  <li>Age: {formData.age} years</li>
                  <li>Goal: {formData.fitnessGoal.replace("_", " ")}</li>
                  <li>Daily Calories: {formData.dailyCalorieTarget} kcal</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 1}
          >
            Back
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Step {step} of 3
            </span>
            {step < 3 ? (
              <Button
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 1 && !formData.name.trim()}
              >
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Get Started"}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

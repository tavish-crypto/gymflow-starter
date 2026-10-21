import { useEffect, useState } from "react";
import { getActivePlan } from "../api";
import type { WorkoutPlan } from "../api/types";
import { useDemo } from "../context/DemoContext";
import { Card, EmptyState, ErrorState, LoadingState, PageHeader } from "../components/UI";

export function WorkoutPlanPage() {
  const { memberId } = useDemo();
  const [plan, setPlan] = useState<WorkoutPlan | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!memberId) return;
    getActivePlan(memberId).then(setPlan).catch((err: Error) => setError(err.message));
  }, [memberId]);

  if (!memberId) return <ErrorState message="No member available" />;
  if (error) return <ErrorState message={error} />;
  if (plan === undefined) return <LoadingState />;

  return (
    <>
      <PageHeader
        title="Workout plan"
        subtitle="Keep the plan editable and structured. AI generation can plug into this later."
        action={<button className="secondary-button" disabled>✦ Generate with AI</button>}
      />
      {!plan ? <EmptyState title="No active plan" description="Create a manual plan first, then add AI generation later." /> : (
        <div className="plan-layout">
          {plan.days.map((day) => (
            <Card key={day.id}>
              <div className="section-heading"><div><h2>{day.title}</h2><p>{day.exercises.length} exercises</p></div></div>
              <div className="plan-exercise-list">
                {day.exercises.map((item) => (
                  <div className="plan-exercise" key={item.id}>
                    <div><strong>{item.exercise.name}</strong><span>{item.exercise.muscleGroup}</span></div>
                    <span>{item.sets} × {item.reps}{item.targetWeightKg ? ` · ${item.targetWeightKg} kg` : ""}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

import { useEffect, useMemo, useState } from "react";
import { completeWorkoutSession, createWorkoutSession, getActivePlan, saveWorkoutLogs } from "../api";
import type { WorkoutPlan } from "../api/types";
import { useDemo } from "../context/DemoContext";
import { Card, EmptyState, ErrorState, LoadingState, PageHeader } from "../components/UI";

type Entry = { weight: string; reps: string; done: boolean };

export function WorkoutPage() {
  const { memberId } = useDemo();
  const [plan, setPlan] = useState<WorkoutPlan | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [entries, setEntries] = useState<Record<string, Entry[]>>({});

  useEffect(() => {
    if (!memberId) return;
    getActivePlan(memberId).then(setPlan).catch((err: Error) => setError(err.message));
  }, [memberId]);

  const day = useMemo(() => {
    if (!plan) return null;
    return plan.days.find((item) => item.dayOfWeek === new Date().getDay()) ?? plan.days[0] ?? null;
  }, [plan]);

  useEffect(() => {
    if (!day) return;
    const initial: Record<string, Entry[]> = {};
    day.exercises.forEach((item) => {
      initial[item.exercise.id] = Array.from({ length: item.sets }, () => ({
        weight: item.targetWeightKg?.toString() ?? "",
        reps: item.reps.toString(),
        done: false,
      }));
    });
    setEntries(initial);
  }, [day]);

  if (!memberId) return <ErrorState message="No member available" />;
  if (error) return <ErrorState message={error} />;
  if (plan === undefined) return <LoadingState />;
  if (!plan || !day) return <EmptyState title="No active workout plan" description="A trainer can create or assign a plan first." />;

  function updateEntry(exerciseId: string, index: number, patch: Partial<Entry>) {
    setEntries((current) => ({
      ...current,
      [exerciseId]: current[exerciseId].map((entry, itemIndex) => itemIndex === index ? { ...entry, ...patch } : entry),
    }));
  }

  async function finishWorkout() {
    try {
      setMessage("Saving workout...");
      const session = await createWorkoutSession(memberId, day.id);
      const logs = day.exercises.flatMap((item) =>
        (entries[item.exercise.id] ?? []).map((entry, index) => ({
          exerciseId: item.exercise.id,
          setNumber: index + 1,
          weightKg: entry.weight ? Number(entry.weight) : undefined,
          reps: entry.reps ? Number(entry.reps) : undefined,
          completed: entry.done,
        }))
      );
      await saveWorkoutLogs(session.id, logs);
      await completeWorkoutSession(session.id);
      setMessage("Workout saved.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Unable to save workout");
    }
  }

  return (
    <>
      <PageHeader title={day.title} subtitle={`${day.exercises.length} exercises · ${plan.name}`} action={<button className="danger-button">End</button>} />
      <div className="workout-stack">
        {day.exercises.map((item) => (
          <Card key={item.id}>
            <div className="section-heading"><div><h2>{item.exercise.name}</h2><p>{item.exercise.muscleGroup}{item.exercise.equipment ? ` · ${item.exercise.equipment}` : ""}</p></div></div>
            <div className="set-table">
              <div className="set-row set-head"><span>Set</span><span>Weight (kg)</span><span>Reps</span><span>Done</span></div>
              {(entries[item.exercise.id] ?? []).map((entry, index) => (
                <div className="set-row" key={index}>
                  <span>{index + 1}</span>
                  <input value={entry.weight} onChange={(event) => updateEntry(item.exercise.id, index, { weight: event.target.value })} inputMode="decimal" />
                  <input value={entry.reps} onChange={(event) => updateEntry(item.exercise.id, index, { reps: event.target.value })} inputMode="numeric" />
                  <input type="checkbox" checked={entry.done} onChange={(event) => updateEntry(item.exercise.id, index, { done: event.target.checked })} />
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      {message ? <p className="save-message">{message}</p> : null}
      <button className="primary-button full finish-button" onClick={finishWorkout}>Finish workout</button>
    </>
  );
}

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { addMeal, getTodayNutrition } from "../api";
import { useDemo } from "../context/DemoContext";
import { Card, ErrorState, LoadingState, PageHeader } from "../components/UI";
import { formatTime } from "../utils/format";

export function NutritionPage() {
  const { memberId } = useDemo();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", calories: "", proteinG: "", carbsG: "", fatG: "" });

  async function load() {
    if (!memberId) return;
    try { setData(await getTodayNutrition(memberId)); } catch (err) { setError(err instanceof Error ? err.message : "Unable to load nutrition"); }
  }

  useEffect(() => { void load(); }, [memberId]);

  if (!memberId) return <ErrorState message="No member available" />;
  if (error) return <ErrorState message={error} />;
  if (!data) return <LoadingState />;

  const goal = data.goal;
  const pct = goal?.calories ? Math.min(100, Math.round(data.consumed.calories / goal.calories * 100)) : 0;

  async function submitMeal(event: FormEvent) {
    event.preventDefault();
    await addMeal(memberId, {
      name: form.name,
      calories: Number(form.calories),
      proteinG: Number(form.proteinG),
      carbsG: Number(form.carbsG),
      fatG: Number(form.fatG),
      eatenAt: new Date().toISOString(),
    });
    setForm({ name: "", calories: "", proteinG: "", carbsG: "", fatG: "" });
    setShowForm(false);
    await load();
  }

  return (
    <>
      <PageHeader title="Nutrition" subtitle="Track the basics well. AI can be layered on later." action={<button className="secondary-button" onClick={() => setShowForm((value) => !value)}>+ Add meal</button>} />
      <Card>
        <div className="nutrition-topline"><div><span className="eyebrow">Daily target</span><strong>{goal?.calories ?? "—"} kcal</strong></div><div><span className="eyebrow">Consumed</span><strong>{data.consumed.calories} kcal</strong></div><span>{pct}%</span></div>
        <div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%` }} /></div>
        <div className="macro-grid">
          <div><span>Protein</span><strong>{data.consumed.proteinG} / {goal?.proteinG ?? "—"} g</strong></div>
          <div><span>Carbs</span><strong>{data.consumed.carbsG} / {goal?.carbsG ?? "—"} g</strong></div>
          <div><span>Fat</span><strong>{data.consumed.fatG} / {goal?.fatG ?? "—"} g</strong></div>
        </div>
      </Card>

      {showForm ? (
        <Card>
          <form className="inline-form" onSubmit={submitMeal}>
            <input required placeholder="Meal name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input required placeholder="Calories" inputMode="numeric" value={form.calories} onChange={(e) => setForm({ ...form, calories: e.target.value })} />
            <input required placeholder="Protein g" inputMode="numeric" value={form.proteinG} onChange={(e) => setForm({ ...form, proteinG: e.target.value })} />
            <input required placeholder="Carbs g" inputMode="numeric" value={form.carbsG} onChange={(e) => setForm({ ...form, carbsG: e.target.value })} />
            <input required placeholder="Fat g" inputMode="numeric" value={form.fatG} onChange={(e) => setForm({ ...form, fatG: e.target.value })} />
            <button className="primary-button" type="submit">Save meal</button>
          </form>
        </Card>
      ) : null}

      <Card>
        <div className="section-heading"><div><h2>Meals</h2><p>Today's logs</p></div></div>
        <div className="meal-list">
          {data.meals.map((meal: any) => (
            <div className="meal-row" key={meal.id}><div><strong>{meal.name}</strong><span>{meal.proteinG}g protein · {meal.carbsG}g carbs</span></div><div><strong>{meal.calories} kcal</strong><small>{formatTime(meal.eatenAt)}</small></div></div>
          ))}
        </div>
        <button className="ai-link" disabled>✦ Ask AI about today's nutrition — intentionally not implemented</button>
      </Card>
    </>
  );
}

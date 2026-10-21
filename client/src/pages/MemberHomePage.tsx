import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMemberHome } from "../api";
import { useDemo } from "../context/DemoContext";
import { Card, ErrorState, LoadingState, PageHeader } from "../components/UI";
import { formatTime } from "../utils/format";

export function MemberHomePage() {
  const { memberId } = useDemo();
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!memberId) return;
    getMemberHome(memberId).then(setData).catch((err: Error) => setError(err.message));
  }, [memberId]);

  if (!memberId) return <ErrorState message="No member available" />;
  if (error) return <ErrorState message={error} />;
  if (!data) return <LoadingState />;

  const member = data.member;
  const target = member.nutritionGoal;
  const activePlan = member.workoutPlans?.[0];
  const todayDay = activePlan?.days?.find((day: any) => day.dayOfWeek === new Date().getDay()) ?? activePlan?.days?.[0];

  return (
    <>
      <PageHeader title={`Good morning, ${member.user.name.split(" ")[0]}`} subtitle="Stay consistent. Good things take time." />
      <Card className="journey-card">
        <div><span className="eyebrow">Your goal</span><h2>{member.goal.replaceAll("_", " ")}</h2></div>
        <div className="journey-values"><strong>{member.currentWeightKg ?? "—"} kg</strong><span>→</span><strong>{member.targetWeightKg ?? "—"} kg</strong></div>
      </Card>
      <div className="two-column-grid member-home-grid">
        <Card>
          <span className="eyebrow">Today's workout</span>
          <h2>{todayDay?.title ?? "Recovery day"}</h2>
          <p>{todayDay ? `${todayDay.exercises.length} exercises` : "No workout scheduled"}</p>
          <button className="primary-button full" onClick={() => navigate("/workout")}>{todayDay ? "Start workout" : "View plan"}</button>
        </Card>
        <Card>
          <span className="eyebrow">Nutrition</span>
          <div className="nutrition-hero"><strong>{data.consumed.calories}</strong><span>/ {target?.calories ?? "—"} kcal</span></div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${target?.calories ? Math.min(100, Math.round(data.consumed.calories / target.calories * 100)) : 0}%` }} /></div>
          <p className="muted">Protein {data.consumed.proteinG} / {target?.proteinG ?? "—"} g</p>
        </Card>
      </div>
      <Card>
        <div className="section-heading"><div><h2>Today's schedule</h2><p>One timeline for workouts, meals and coaching.</p></div><button className="text-button" onClick={() => navigate("/calendar")}>View calendar</button></div>
        <div className="schedule-list horizontal-friendly">
          {data.events.map((event: any) => (
            <div className="schedule-row" key={event.id}><strong>{formatTime(event.startAt)}</strong><div><span>{event.title}</span><small>{event.type.replaceAll("_", " ")}</small></div></div>
          ))}
        </div>
      </Card>
    </>
  );
}

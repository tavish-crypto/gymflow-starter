import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getMember } from "../api";
import { useDemo } from "../context/DemoContext";
import { Badge, Card, ErrorState, LoadingState } from "../components/UI";
import { formatDateTime, formatGoal } from "../utils/format";

export function MemberProfilePage() {
  const params = useParams();
  const { memberId } = useDemo();
  const id = params.id ?? memberId;
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getMember(id).then(setData).catch((err: Error) => setError(err.message));
  }, [id]);

  if (!id) return <ErrorState message="No member selected" />;
  if (error) return <ErrorState message={error} />;
  if (!data) return <LoadingState label="Loading member" />;

  const member = data.member;
  const current = member.currentWeightKg ?? member.progressEntries?.[0]?.weightKg ?? 0;
  const target = member.targetWeightKg ?? current;
  const start = member.progressEntries?.at(-1)?.weightKg ?? current;
  const totalChange = Math.abs(start - target);
  const achieved = Math.abs(start - current);
  const progress = totalChange > 0 ? Math.min(100, Math.round((achieved / totalChange) * 100)) : 0;

  return (
    <>
      <div className="back-row"><Link to="/members">← Back to members</Link></div>
      <div className="profile-heading">
        <div>
          <div className="title-with-badge"><h1>{member.user.name}</h1><Badge tone="green">{member.status}</Badge></div>
          <p>{formatGoal(member.goal)} journey · {member.membership?.planName ?? "No membership"} · Trainer: {member.trainer?.user.name ?? "Unassigned"}</p>
        </div>
        <button className="secondary-button">Edit</button>
      </div>

      <div className="tab-row">
        <button className="tab active">Overview</button>
        <button className="tab">Workouts</button>
        <button className="tab">Nutrition</button>
        <button className="tab">Progress</button>
        <button className="tab">Calendar</button>
      </div>

      <div className="two-column-grid">
        <Card>
          <h2>Goal progress</h2>
          <div className="weight-row"><strong>{current || "—"} kg</strong><span>→</span><strong>{target || "—"} kg</strong></div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
          <p className="muted">{progress}% complete</p>
          <div className="mini-metrics">
            <div><strong>{data.workoutAdherence}%</strong><span>Workout adherence</span></div>
            <div><strong>{member.attendances?.length ?? 0}</strong><span>Recent visits</span></div>
            <div><strong>{member.workoutPlans?.length ? "Active" : "None"}</strong><span>Workout plan</span></div>
          </div>
        </Card>
        <Card>
          <h2>Member details</h2>
          <dl className="detail-list">
            <div><dt>Goal</dt><dd>{formatGoal(member.goal)}</dd></div>
            <div><dt>Height</dt><dd>{member.heightCm ? `${member.heightCm} cm` : "—"}</dd></div>
            <div><dt>Current weight</dt><dd>{member.currentWeightKg ? `${member.currentWeightKg} kg` : "—"}</dd></div>
            <div><dt>Target weight</dt><dd>{member.targetWeightKg ? `${member.targetWeightKg} kg` : "—"}</dd></div>
            <div><dt>Membership</dt><dd>{member.membership?.planName ?? "—"}</dd></div>
            <div><dt>Joined</dt><dd>{formatDateTime(member.joinedAt)}</dd></div>
          </dl>
        </Card>
      </div>
    </>
  );
}

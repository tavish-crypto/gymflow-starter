import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFitnessManagerDashboard } from "../api";
import type { FitnessManagerDashboard } from "../api/types";
import { Badge, Card, ErrorState, LoadingState, MetricCard, PageHeader } from "../components/UI";
import { formatGoal } from "../utils/format";

export function FitnessManagerPage() {
  const [data, setData] = useState<FitnessManagerDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getFitnessManagerDashboard().then(setData).catch((err: Error) => setError(err.message));
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!data) return <LoadingState />;

  return (
    <>
      <PageHeader title="Fitness overview" subtitle="Focus on members who need intervention, not every member at once." />
      <div className="metrics-grid four">
        <MetricCard label="Under coaching" value={data.metrics.underCoaching} tone="green" />
        <MetricCard label="Need review" value={data.metrics.needReview} tone="red" />
        <MetricCard label="Without workout plan" value={data.metrics.withoutWorkoutPlan} tone="blue" />
        <MetricCard label="Low adherence" value={data.metrics.lowAdherence} tone="amber" />
      </div>
      <Card>
        <div className="section-heading"><div><h2>Members needing attention</h2><p>Review one clear next action at a time.</p></div></div>
        <div className="attention-grid">
          {data.attention.map((member) => (
            <div className="member-attention-card" key={member.id}>
              <div className="title-with-badge"><strong>{member.name}</strong><Badge tone={member.status === "INACTIVE" ? "red" : "amber"}>{member.status.replace("_", " ")}</Badge></div>
              <p>{formatGoal(member.goal)} · {member.trainerName ?? "No trainer"}</p>
              <button className="secondary-button" onClick={() => navigate(`/members/${member.id}`)}>Review member</button>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

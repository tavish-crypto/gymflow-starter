import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTrainerDashboard } from "../api";
import type { TrainerDashboard } from "../api/types";
import { useDemo } from "../context/DemoContext";
import { Badge, Card, ErrorState, LoadingState, PageHeader } from "../components/UI";
import { formatGoal, formatTime } from "../utils/format";

export function TrainerDashboardPage() {
  const { trainerId } = useDemo();
  const [data, setData] = useState<TrainerDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!trainerId) return;
    getTrainerDashboard(trainerId).then(setData).catch((err: Error) => setError(err.message));
  }, [trainerId]);

  if (!trainerId) return <ErrorState message="No trainer available in demo data" />;
  if (error) return <ErrorState message={error} />;
  if (!data) return <LoadingState />;

  return (
    <>
      <PageHeader title={`Good morning, ${data.trainer.name.split(" ")[0]}`} subtitle="Your day should be obvious at a glance." />
      <div className="two-column-grid">
        <Card>
          <h2>Today's schedule</h2>
          <div className="schedule-list">
            {data.schedule.map((event) => (
              <div className="schedule-row" key={event.id}><strong>{formatTime(event.startAt)}</strong><div><span>{event.title}</span><small>{event.description ?? event.type.replace("_", " ")}</small></div></div>
            ))}
          </div>
        </Card>
        <Card>
          <h2>My members</h2>
          <div className="attention-list">
            {data.members.map((member) => (
              <div className="attention-row" key={member.id}>
                <div><strong>{member.name}</strong><span>{formatGoal(member.goal)} · {member.adherence}% adherence</span></div>
                <button className="text-button" onClick={() => navigate(`/members/${member.id}`)}>{member.status === "AT_RISK" ? "Review" : "Open"}</button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

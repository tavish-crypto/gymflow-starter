import { useEffect, useState } from "react";
import { getAdminDashboard } from "../api";
import type { AdminDashboard } from "../api/types";
import { useDemo } from "../context/DemoContext";
import { Card, ErrorState, LoadingState, MetricCard, PageHeader, Badge } from "../components/UI";
import { formatDateTime } from "../utils/format";

function AttendanceChart({ data }: { data: AdminDashboard["attendanceByDay"] }) {
  const width = 520;
  const height = 180;
  const max = Math.max(1, ...data.map((point) => point.count));
  const points = data.map((point, index) => {
    const x = 22 + (index * (width - 44)) / Math.max(data.length - 1, 1);
    const y = height - 26 - (point.count / max) * (height - 52);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Attendance over the last seven days">
        <polyline fill="none" stroke="var(--brand)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={points} />
        {data.map((point, index) => {
          const [x, y] = points.split(" ")[index].split(",").map(Number);
          return <circle key={point.date} cx={x} cy={y} r="4" fill="var(--brand)" />;
        })}
      </svg>
      <div className="chart-labels">
        {data.map((point) => <span key={point.date}>{new Date(point.date).toLocaleDateString("en-IN", { weekday: "short" })}</span>)}
      </div>
    </div>
  );
}

export function AdminDashboardPage() {
  const { currentName } = useDemo();
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAdminDashboard().then(setData).catch((err: Error) => setError(err.message));
  }, []);

  if (error) return <ErrorState message={error} />;
  if (!data) return <LoadingState label="Loading dashboard" />;

  return (
    <>
      <PageHeader title={`Good morning, ${currentName.split(" ")[0]}`} subtitle="Here’s what is happening at your gym today." />
      <div className="metrics-grid four">
        <MetricCard label="Active members" value={data.metrics.activeMembers} tone="green" />
        <MetricCard label="Today's check-ins" value={data.metrics.todayCheckins} tone="blue" />
        <MetricCard label="Expiring soon" value={data.metrics.expiringSoon} tone="amber" />
        <MetricCard label="Inactive members" value={data.metrics.inactiveMembers} tone="red" />
      </div>
      <div className="two-column-grid dashboard-grid">
        <Card>
          <div className="section-heading">
            <div><h2>Attendance</h2><p>Last 7 days</p></div>
          </div>
          <AttendanceChart data={data.attendanceByDay} />
        </Card>
        <Card>
          <div className="section-heading"><div><h2>Members needing attention</h2><p>Keep the next action obvious.</p></div></div>
          <div className="attention-list">
            {data.attention.map((member) => (
              <div className="attention-row" key={member.id}>
                <div>
                  <strong>{member.name}</strong>
                  <span>{member.status === "INACTIVE" ? "Inactive member" : "Needs follow-up"}</span>
                </div>
                <div className="attention-meta">
                  {member.membershipStatus === "EXPIRING" ? <Badge tone="amber">Expiring</Badge> : <Badge tone={member.status === "INACTIVE" ? "red" : "amber"}>{member.status.replace("_", " ")}</Badge>}
                  {member.membershipEndDate ? <small>{formatDateTime(member.membershipEndDate)}</small> : null}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

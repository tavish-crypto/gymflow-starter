import type { ReactNode } from "react";

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export function MetricCard({ label, value, note, tone = "neutral" }: { label: string; value: string | number; note?: string; tone?: "neutral" | "green" | "amber" | "red" | "blue" }) {
  return (
    <div className={`metric-card tone-${tone}`}>
      <span className="metric-label">{label}</span>
      <strong className="metric-value">{value}</strong>
      {note ? <small>{note}</small> : null}
    </div>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "green" | "amber" | "red" | "blue" }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{children}</section>;
}

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div className="loading-stack" aria-label={label}>
      <div className="skeleton large" />
      <div className="skeleton" />
      <div className="skeleton" />
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

export function ErrorState({ message }: { message: string }) {
  return <div className="error-state">{message}</div>;
}

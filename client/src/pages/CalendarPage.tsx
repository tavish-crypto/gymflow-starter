import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { getCalendar, scheduleEvent } from "../api";
import type { CalendarEvent } from "../api/types";
import { useDemo } from "../context/DemoContext";
import { Card, ErrorState, LoadingState, PageHeader } from "../components/UI";
import { formatTime } from "../utils/format";

export function CalendarPage() {
  const { memberId } = useDemo();
  const [events, setEvents] = useState<CalendarEvent[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("WORKOUT");
  const [time, setTime] = useState("18:00");

  const monthStart = useMemo(() => new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1), [selectedDate]);
  const monthEnd = useMemo(() => new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0, 23, 59, 59), [selectedDate]);

  async function load() {
    if (!memberId) return;
    try { setEvents(await getCalendar(memberId, monthStart.toISOString(), monthEnd.toISOString())); } catch (err) { setError(err instanceof Error ? err.message : "Unable to load calendar"); }
  }

  useEffect(() => { void load(); }, [memberId, monthStart.toISOString(), monthEnd.toISOString()]);

  if (!memberId) return <ErrorState message="No member available" />;
  if (error) return <ErrorState message={error} />;
  if (!events) return <LoadingState />;

  const firstDay = monthStart.getDay();
  const daysInMonth = monthEnd.getDate();
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, index) => index < firstDay ? null : index - firstDay + 1);
  const selectedKey = selectedDate.toISOString().slice(0, 10);
  const selectedEvents = events.filter((event) => event.startAt.slice(0, 10) === selectedKey);

  async function add(event: FormEvent) {
    event.preventDefault();
    const [hours, minutes] = time.split(":").map(Number);
    const startAt = new Date(selectedDate);
    startAt.setHours(hours, minutes, 0, 0);
    await scheduleEvent({ memberId, type, title, startAt: startAt.toISOString() });
    setTitle("");
    setShowForm(false);
    await load();
  }

  return (
    <>
      <PageHeader title="Calendar" subtitle="Workouts, coaching and reminders in one predictable place." action={<button className="primary-button" onClick={() => setShowForm((value) => !value)}>+ Schedule activity</button>} />
      <div className="calendar-layout">
        <Card className="calendar-card">
          <div className="calendar-header"><button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))}>‹</button><strong>{selectedDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</strong><button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))}>›</button></div>
          <div className="calendar-weekdays">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((day) => <span key={day}>{day}</span>)}</div>
          <div className="calendar-grid">
            {cells.map((day, index) => {
              if (!day) return <div key={`empty-${index}`} />;
              const date = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
              const key = date.toISOString().slice(0, 10);
              const hasEvents = events.some((event) => event.startAt.slice(0, 10) === key);
              const active = key === selectedKey;
              return <button key={key} className={`calendar-day ${active ? "active" : ""}`} onClick={() => setSelectedDate(date)}><span>{day}</span>{hasEvents ? <i /> : null}</button>;
            })}
          </div>
        </Card>
        <Card>
          <h2>{selectedDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</h2>
          <div className="schedule-list">
            {selectedEvents.length ? selectedEvents.map((event) => <div className="schedule-row" key={event.id}><strong>{formatTime(event.startAt)}</strong><div><span>{event.title}</span><small>{event.type.replaceAll("_", " ")}</small></div></div>) : <p className="muted">No activities scheduled.</p>}
          </div>
          {showForm ? <form className="calendar-form" onSubmit={add}><input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Activity title" /><select value={type} onChange={(e) => setType(e.target.value)}><option>WORKOUT</option><option>MEAL</option><option>TRAINER_SESSION</option><option>PROGRESS_REVIEW</option><option>WEIGHT_CHECK</option><option>REMINDER</option></select><input type="time" value={time} onChange={(e) => setTime(e.target.value)} /><button className="primary-button">Save</button></form> : null}
        </Card>
      </div>
    </>
  );
}

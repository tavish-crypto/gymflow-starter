import { apiFetch } from "./client";
import type {
  AdminDashboard,
  CalendarEvent,
  DemoContext,
  FitnessManagerDashboard,
  Member,
  TrainerDashboard,
  WorkoutPlan,
} from "./types";

export async function getDemoContext() {
  return (await apiFetch<{ data: DemoContext }>("/demo/context")).data;
}

export async function getAdminDashboard() {
  return (await apiFetch<{ data: AdminDashboard }>("/dashboard/admin")).data;
}

export async function getFitnessManagerDashboard() {
  return (await apiFetch<{ data: FitnessManagerDashboard }>("/dashboard/fitness-manager")).data;
}

export async function getMembers(search = "") {
  const suffix = search ? `?search=${encodeURIComponent(search)}` : "";
  return (await apiFetch<{ data: Member[] }>(`/members${suffix}`)).data;
}

export async function createMember(payload: Record<string, unknown>) {
  return apiFetch("/members", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMember(id: string) {
  return (await apiFetch<{ data: { member: any; workoutAdherence: number } }>(`/members/${id}`)).data;
}

export async function getMemberHome(id: string) {
  return (await apiFetch<{ data: any }>(`/members/${id}/home`)).data;
}

export async function getTrainers() {
  return (await apiFetch<{ data: any[] }>("/trainers")).data;
}

export async function getTrainerDashboard(id: string) {
  return (await apiFetch<{ data: TrainerDashboard }>(`/trainers/${id}/dashboard`)).data;
}

export async function getActivePlan(memberId: string) {
  return (await apiFetch<{ data: WorkoutPlan | null }>(`/workouts/member/${memberId}/active-plan`)).data;
}

export async function createWorkoutSession(memberId: string, workoutDayId?: string) {
  return (
    await apiFetch<{ data: { id: string } }>(`/workouts/member/${memberId}/sessions`, {
      method: "POST",
      body: JSON.stringify({ workoutDayId, scheduledFor: new Date().toISOString() }),
    })
  ).data;
}

export async function saveWorkoutLogs(
  sessionId: string,
  logs: Array<{ exerciseId: string; setNumber: number; weightKg?: number; reps?: number; completed: boolean }>
) {
  return apiFetch(`/workouts/sessions/${sessionId}/logs`, {
    method: "PUT",
    body: JSON.stringify({ logs }),
  });
}

export async function completeWorkoutSession(sessionId: string) {
  return apiFetch(`/workouts/sessions/${sessionId}`, {
    method: "PATCH",
    body: JSON.stringify({ status: "COMPLETED" }),
  });
}

export async function getTodayNutrition(memberId: string) {
  return (await apiFetch<{ data: any }>(`/nutrition/member/${memberId}/today`)).data;
}

export async function addMeal(memberId: string, meal: Record<string, unknown>) {
  return apiFetch(`/nutrition/member/${memberId}/meals`, {
    method: "POST",
    body: JSON.stringify(meal),
  });
}

export async function getCalendar(memberId: string, from?: string, to?: string) {
  const query = new URLSearchParams();
  if (from) query.set("from", from);
  if (to) query.set("to", to);
  const suffix = query.toString() ? `?${query}` : "";
  return (await apiFetch<{ data: CalendarEvent[] }>(`/calendar/member/${memberId}${suffix}`)).data;
}

export async function scheduleEvent(payload: Record<string, unknown>) {
  return apiFetch("/calendar/events", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

import { findTrainerDashboard, findTrainers } from "./trainers.repository";

export const getTrainers = findTrainers;

export async function getTrainerDashboard(id: string) {
  const result = await findTrainerDashboard(id);
  if (!result) return { success: false as const, reason: "NOT_FOUND" as const };

  const members = result.trainer.members.map((member) => {
    const trackable = member.workoutSessions.filter((session) => session.status !== "PLANNED");
    const completed = trackable.filter((session) => session.status === "COMPLETED").length;
    const adherence = trackable.length ? Math.round((completed / trackable.length) * 100) : 0;
    return {
      id: member.id,
      name: member.user.name,
      goal: member.goal,
      status: member.status,
      adherence,
    };
  });

  return {
    success: true as const,
    trainer: { id: result.trainer.id, name: result.trainer.user.name },
    schedule: result.schedule,
    members,
  };
}

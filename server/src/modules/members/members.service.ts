import { createMemberRecord, findMemberById, findMemberHomeData, findMembers } from "./members.repository";

export async function getMembers(search?: string, status?: string, trainerId?: string) {
  return findMembers(search, status, trainerId);
}

export async function getMember(id: string) {
  const member = await findMemberById(id);
  if (!member) return { success: false as const, reason: "NOT_FOUND" as const };

  const completed = member.workoutSessions.filter((session) => session.status === "COMPLETED").length;
  const trackable = member.workoutSessions.filter((session) => session.status !== "PLANNED").length;
  const workoutAdherence = trackable ? Math.round((completed / trackable) * 100) : 0;

  return { success: true as const, member, workoutAdherence };
}

export async function createMember(input: Parameters<typeof createMemberRecord>[0]) {
  return createMemberRecord(input);
}

export async function getMemberHome(id: string) {
  const data = await findMemberHomeData(id);
  if (!data) return { success: false as const, reason: "NOT_FOUND" as const };

  const consumed = data.meals.reduce(
    (sum, meal) => ({
      calories: sum.calories + meal.calories,
      proteinG: sum.proteinG + meal.proteinG,
      carbsG: sum.carbsG + meal.carbsG,
      fatG: sum.fatG + meal.fatG,
    }),
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
  );

  return { success: true as const, ...data, consumed };
}

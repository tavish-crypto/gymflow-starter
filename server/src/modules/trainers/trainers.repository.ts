import { db } from "../../db";
import { endOfDay, startOfDay } from "../../utils/date";

export async function findTrainers() {
  return db.trainerProfile.findMany({
    include: {
      user: { select: { id: true, name: true, email: true } },
      _count: { select: { members: true } },
    },
    orderBy: { user: { name: "asc" } },
  });
}

export async function findTrainerDashboard(id: string) {
  const trainer = await db.trainerProfile.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, id: true } },
      members: {
        include: {
          user: { select: { name: true } },
          workoutSessions: { orderBy: { scheduledFor: "desc" }, take: 12 },
        },
      },
    },
  });

  if (!trainer) return null;

  const todayStart = startOfDay();
  const todayEnd = endOfDay();
  const schedule = await db.calendarEvent.findMany({
    where: {
      userId: trainer.user.id,
      startAt: { gte: todayStart, lte: todayEnd },
    },
    orderBy: { startAt: "asc" },
  });

  return { trainer, schedule };
}

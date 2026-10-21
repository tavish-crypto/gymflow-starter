import { db } from "../../db";

export async function findCalendarEvents(memberId: string, from?: Date, to?: Date) {
  return db.calendarEvent.findMany({
    where: {
      memberId,
      ...(from || to
        ? {
            startAt: {
              ...(from ? { gte: from } : {}),
              ...(to ? { lte: to } : {}),
            },
          }
        : {}),
    },
    orderBy: { startAt: "asc" },
  });
}

export async function createCalendarEvent(data: {
  userId?: string;
  memberId?: string;
  type: "WORKOUT" | "MEAL" | "TRAINER_SESSION" | "CLASS" | "PROGRESS_REVIEW" | "WEIGHT_CHECK" | "REMINDER";
  title: string;
  description?: string;
  startAt: Date;
  endAt?: Date;
  relatedId?: string;
}) {
  return db.calendarEvent.create({ data });
}

export async function deleteCalendarEvent(id: string) {
  return db.calendarEvent.delete({ where: { id } });
}

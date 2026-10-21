import { z } from "zod";

export const calendarEventSchema = z.object({
  userId: z.string().optional(),
  memberId: z.string().optional(),
  type: z.enum(["WORKOUT", "MEAL", "TRAINER_SESSION", "CLASS", "PROGRESS_REVIEW", "WEIGHT_CHECK", "REMINDER"]),
  title: z.string().min(2).max(120),
  description: z.string().max(500).optional(),
  startAt: z.string().datetime(),
  endAt: z.string().datetime().optional(),
  relatedId: z.string().optional(),
});

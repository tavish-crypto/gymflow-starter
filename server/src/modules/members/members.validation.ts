import { z } from "zod";

export const createMemberSchema = z.object({
  gymId: z.string().min(1),
  name: z.string().min(2).max(80),
  email: z.string().email(),
  goal: z.enum(["FAT_LOSS", "MUSCLE_GAIN", "STRENGTH", "GENERAL_FITNESS", "MAINTENANCE"]),
  currentWeightKg: z.number().positive().optional(),
  targetWeightKg: z.number().positive().optional(),
  heightCm: z.number().positive().optional(),
  trainerId: z.string().optional(),
  membershipPlan: z.string().min(1).default("Standard"),
  membershipMonths: z.number().int().min(1).max(36).default(1),
});

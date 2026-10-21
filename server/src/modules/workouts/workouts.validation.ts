import { z } from "zod";

export const createWorkoutPlanSchema = z.object({
  createdById: z.string().min(1),
  name: z.string().min(2).max(120),
  goal: z.enum(["FAT_LOSS", "MUSCLE_GAIN", "STRENGTH", "GENERAL_FITNESS", "MAINTENANCE"]),
  days: z.array(
    z.object({
      title: z.string().min(2),
      dayOfWeek: z.number().int().min(0).max(6),
      exercises: z.array(
        z.object({
          name: z.string().min(2),
          muscleGroup: z.string().min(2),
          equipment: z.string().optional(),
          sets: z.number().int().min(1).max(20),
          reps: z.number().int().min(1).max(100),
          targetWeightKg: z.number().nonnegative().optional(),
        })
      ).min(1),
    })
  ).min(1),
});

export const createSessionSchema = z.object({
  workoutDayId: z.string().optional(),
  scheduledFor: z.string().datetime(),
});

export const updateSessionSchema = z.object({
  status: z.enum(["PLANNED", "IN_PROGRESS", "COMPLETED", "SKIPPED"]),
});

export const saveExerciseLogsSchema = z.object({
  logs: z.array(
    z.object({
      exerciseId: z.string().min(1),
      setNumber: z.number().int().min(1),
      weightKg: z.number().nonnegative().optional(),
      reps: z.number().int().nonnegative().optional(),
      completed: z.boolean(),
    })
  ),
});

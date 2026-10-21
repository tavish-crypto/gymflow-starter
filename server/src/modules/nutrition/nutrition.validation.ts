import { z } from "zod";

export const nutritionGoalSchema = z.object({
  calories: z.number().int().min(800).max(6000),
  proteinG: z.number().int().min(0).max(500),
  carbsG: z.number().int().min(0).max(1000),
  fatG: z.number().int().min(0).max(300),
  waterMl: z.number().int().min(500).max(10000).default(3000),
});

export const mealSchema = z.object({
  name: z.string().min(2).max(120),
  calories: z.number().int().nonnegative(),
  proteinG: z.number().int().nonnegative(),
  carbsG: z.number().int().nonnegative(),
  fatG: z.number().int().nonnegative(),
  eatenAt: z.string().datetime(),
});

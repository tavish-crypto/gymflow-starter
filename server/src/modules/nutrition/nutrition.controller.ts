import { Request, Response } from "express";
import { mealSchema, nutritionGoalSchema } from "./nutrition.validation";
import { addMeal, getTodayNutrition, setNutritionGoal } from "./nutrition.service";

export async function todayNutritionController(req: Request, res: Response) {
  try {
    res.json({ data: await getTodayNutrition(req.params.memberId) });
  } catch (error) {
    console.error("Nutrition load failed", error);
    res.status(500).json({ error: "Unable to load nutrition" });
  }
}

export async function nutritionGoalController(req: Request, res: Response) {
  const parsed = nutritionGoalSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
  try {
    res.json({ data: await setNutritionGoal(req.params.memberId, parsed.data) });
  } catch (error) {
    console.error("Nutrition goal failed", error);
    res.status(500).json({ error: "Unable to save nutrition goal" });
  }
}

export async function addMealController(req: Request, res: Response) {
  const parsed = mealSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
  try {
    res.status(201).json({ data: await addMeal(req.params.memberId, { ...parsed.data, eatenAt: new Date(parsed.data.eatenAt) }) });
  } catch (error) {
    console.error("Add meal failed", error);
    res.status(500).json({ error: "Unable to add meal" });
  }
}

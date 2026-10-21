import { db } from "../../db";
import { endOfDay, startOfDay } from "../../utils/date";

export async function findTodayNutrition(memberId: string) {
  const [goal, meals] = await Promise.all([
    db.nutritionGoal.findUnique({ where: { memberId } }),
    db.mealLog.findMany({
      where: { memberId, eatenAt: { gte: startOfDay(), lte: endOfDay() } },
      orderBy: { eatenAt: "asc" },
    }),
  ]);
  return { goal, meals };
}

export async function upsertNutritionGoal(memberId: string, data: { calories: number; proteinG: number; carbsG: number; fatG: number; waterMl: number }) {
  return db.nutritionGoal.upsert({
    where: { memberId },
    update: data,
    create: { memberId, ...data },
  });
}

export async function createMeal(memberId: string, data: { name: string; calories: number; proteinG: number; carbsG: number; fatG: number; eatenAt: Date }) {
  return db.mealLog.create({ data: { memberId, ...data } });
}

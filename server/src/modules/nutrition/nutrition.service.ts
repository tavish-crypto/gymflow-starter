import { createMeal, findTodayNutrition, upsertNutritionGoal } from "./nutrition.repository";

export async function getTodayNutrition(memberId: string) {
  const data = await findTodayNutrition(memberId);
  const consumed = data.meals.reduce(
    (sum, meal) => ({
      calories: sum.calories + meal.calories,
      proteinG: sum.proteinG + meal.proteinG,
      carbsG: sum.carbsG + meal.carbsG,
      fatG: sum.fatG + meal.fatG,
    }),
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 }
  );
  return { ...data, consumed };
}

export const setNutritionGoal = upsertNutritionGoal;
export const addMeal = createMeal;

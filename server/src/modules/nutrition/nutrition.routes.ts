import { Router } from "express";
import { addMealController, nutritionGoalController, todayNutritionController } from "./nutrition.controller";

export const nutritionRouter = Router();

nutritionRouter.get("/member/:memberId/today", todayNutritionController);
nutritionRouter.put("/member/:memberId/goal", nutritionGoalController);
nutritionRouter.post("/member/:memberId/meals", addMealController);

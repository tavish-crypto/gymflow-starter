import { Router } from "express";
import {
  activePlanController,
  createPlanController,
  createSessionController,
  saveLogsController,
  updateSessionController,
} from "./workouts.controller";

export const workoutsRouter = Router();

workoutsRouter.get("/member/:memberId/active-plan", activePlanController);
workoutsRouter.post("/member/:memberId/plans", createPlanController);
workoutsRouter.post("/member/:memberId/sessions", createSessionController);
workoutsRouter.patch("/sessions/:id", updateSessionController);
workoutsRouter.put("/sessions/:id/logs", saveLogsController);

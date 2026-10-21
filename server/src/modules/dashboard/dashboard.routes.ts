import { Router } from "express";
import {
  adminDashboardController,
  fitnessManagerDashboardController,
} from "./dashboard.controller";

export const dashboardRouter = Router();

dashboardRouter.get("/admin", adminDashboardController);
dashboardRouter.get("/fitness-manager", fitnessManagerDashboardController);

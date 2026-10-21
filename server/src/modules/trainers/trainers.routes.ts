import { Router } from "express";
import { listTrainersController, trainerDashboardController } from "./trainers.controller";

export const trainersRouter = Router();

trainersRouter.get("/", listTrainersController);
trainersRouter.get("/:id/dashboard", trainerDashboardController);

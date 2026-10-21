import { Request, Response } from "express";
import { getTrainerDashboard, getTrainers } from "./trainers.service";

export async function listTrainersController(_req: Request, res: Response) {
  try {
    res.json({ data: await getTrainers() });
  } catch (error) {
    console.error("List trainers failed", error);
    res.status(500).json({ error: "Unable to load trainers" });
  }
}

export async function trainerDashboardController(req: Request, res: Response) {
  try {
    const result = await getTrainerDashboard(req.params.id);
    if (!result.success) return res.status(404).json({ error: "Trainer not found" });
    res.json({ data: result });
  } catch (error) {
    console.error("Trainer dashboard failed", error);
    res.status(500).json({ error: "Unable to load trainer dashboard" });
  }
}

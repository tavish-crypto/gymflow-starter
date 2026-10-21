import { Request, Response } from "express";
import { getAdminDashboard, getFitnessManagerDashboard } from "./dashboard.service";

export async function adminDashboardController(_req: Request, res: Response) {
  try {
    res.json({ data: await getAdminDashboard() });
  } catch (error) {
    console.error("Admin dashboard failed", error);
    res.status(500).json({ error: "Unable to load dashboard" });
  }
}

export async function fitnessManagerDashboardController(_req: Request, res: Response) {
  try {
    res.json({ data: await getFitnessManagerDashboard() });
  } catch (error) {
    console.error("Fitness manager dashboard failed", error);
    res.status(500).json({ error: "Unable to load fitness dashboard" });
  }
}

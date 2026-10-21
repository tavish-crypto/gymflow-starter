import { Request, Response } from "express";
import {
  createSessionSchema,
  createWorkoutPlanSchema,
  saveExerciseLogsSchema,
  updateSessionSchema,
} from "./workouts.validation";
import { changeSessionStatus, createPlan, createSession, getActivePlan, saveSessionLogs } from "./workouts.service";

export async function activePlanController(req: Request, res: Response) {
  try {
    res.json({ data: await getActivePlan(req.params.memberId) });
  } catch (error) {
    console.error("Active plan failed", error);
    res.status(500).json({ error: "Unable to load workout plan" });
  }
}

export async function createPlanController(req: Request, res: Response) {
  const parsed = createWorkoutPlanSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
  try {
    res.status(201).json({ data: await createPlan(req.params.memberId, parsed.data) });
  } catch (error) {
    console.error("Create plan failed", error);
    res.status(500).json({ error: "Unable to create workout plan" });
  }
}

export async function createSessionController(req: Request, res: Response) {
  const parsed = createSessionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
  try {
    res.status(201).json({ data: await createSession(req.params.memberId, parsed.data.workoutDayId, new Date(parsed.data.scheduledFor)) });
  } catch (error) {
    console.error("Create session failed", error);
    res.status(500).json({ error: "Unable to schedule workout" });
  }
}

export async function updateSessionController(req: Request, res: Response) {
  const parsed = updateSessionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Validation failed" });
  try {
    res.json({ data: await changeSessionStatus(req.params.id, parsed.data.status) });
  } catch (error) {
    console.error("Update session failed", error);
    res.status(500).json({ error: "Unable to update workout session" });
  }
}

export async function saveLogsController(req: Request, res: Response) {
  const parsed = saveExerciseLogsSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
  try {
    res.json({ data: await saveSessionLogs(req.params.id, parsed.data.logs) });
  } catch (error) {
    console.error("Save logs failed", error);
    res.status(500).json({ error: "Unable to save exercise logs" });
  }
}

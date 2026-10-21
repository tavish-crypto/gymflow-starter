import { Request, Response } from "express";
import { getDemoContext } from "./demo.repository";

export async function demoContextController(_req: Request, res: Response) {
  try {
    res.json({ data: await getDemoContext() });
  } catch (error) {
    console.error("Demo context failed", error);
    res.status(500).json({ error: "Unable to load demo context" });
  }
}

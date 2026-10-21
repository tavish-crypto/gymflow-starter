import { Request, Response, Router } from "express";

export const aiRouter = Router();

function notImplemented(_req: Request, res: Response) {
  res.status(501).json({
    error: "AI integration intentionally not implemented",
    nextStep: "Implement this endpoint yourself using Gemini/OpenAI, structured JSON output, and Zod validation.",
  });
}

aiRouter.post("/workout-plan", notImplemented);
aiRouter.post("/nutrition", notImplemented);
aiRouter.post("/progress-summary", notImplemented);

import cors from "cors";
import express from "express";
import { dashboardRouter } from "./modules/dashboard/dashboard.routes";
import { membersRouter } from "./modules/members/members.routes";
import { trainersRouter } from "./modules/trainers/trainers.routes";
import { workoutsRouter } from "./modules/workouts/workouts.routes";
import { nutritionRouter } from "./modules/nutrition/nutrition.routes";
import { calendarRouter } from "./modules/calendar/calendar.routes";
import { aiRouter } from "./modules/ai/ai.routes";
import { demoRouter } from "./modules/demo/demo.routes";

export const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "gymflow-api" });
});

app.use("/api/dashboard", dashboardRouter);
app.use("/api/members", membersRouter);
app.use("/api/trainers", trainersRouter);
app.use("/api/workouts", workoutsRouter);
app.use("/api/nutrition", nutritionRouter);
app.use("/api/calendar", calendarRouter);
app.use("/api/ai", aiRouter);
app.use("/api/demo", demoRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

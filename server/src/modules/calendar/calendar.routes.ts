import { Router } from "express";
import { createCalendarController, deleteCalendarController, listCalendarController } from "./calendar.controller";

export const calendarRouter = Router();

calendarRouter.get("/member/:memberId", listCalendarController);
calendarRouter.post("/events", createCalendarController);
calendarRouter.delete("/events/:id", deleteCalendarController);

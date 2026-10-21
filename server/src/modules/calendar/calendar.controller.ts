import { Request, Response } from "express";
import { calendarEventSchema } from "./calendar.validation";
import { addCalendarEvent, getCalendarEvents, removeCalendarEvent } from "./calendar.service";

export async function listCalendarController(req: Request, res: Response) {
  try {
    const from = typeof req.query.from === "string" ? new Date(req.query.from) : undefined;
    const to = typeof req.query.to === "string" ? new Date(req.query.to) : undefined;
    res.json({ data: await getCalendarEvents(req.params.memberId, from, to) });
  } catch (error) {
    console.error("Calendar load failed", error);
    res.status(500).json({ error: "Unable to load calendar" });
  }
}

export async function createCalendarController(req: Request, res: Response) {
  const parsed = calendarEventSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
  try {
    res.status(201).json({
      data: await addCalendarEvent({
        ...parsed.data,
        startAt: new Date(parsed.data.startAt),
        endAt: parsed.data.endAt ? new Date(parsed.data.endAt) : undefined,
      }),
    });
  } catch (error) {
    console.error("Calendar create failed", error);
    res.status(500).json({ error: "Unable to schedule activity" });
  }
}

export async function deleteCalendarController(req: Request, res: Response) {
  try {
    await removeCalendarEvent(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Calendar delete failed", error);
    res.status(500).json({ error: "Unable to remove activity" });
  }
}

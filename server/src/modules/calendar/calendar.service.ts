import { createCalendarEvent, deleteCalendarEvent, findCalendarEvents } from "./calendar.repository";

export const getCalendarEvents = findCalendarEvents;
export const addCalendarEvent = createCalendarEvent;
export const removeCalendarEvent = deleteCalendarEvent;

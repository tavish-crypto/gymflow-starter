import {
  createWorkoutPlanRecord,
  createWorkoutSession,
  findActivePlan,
  replaceExerciseLogs,
  updateWorkoutSession,
} from "./workouts.repository";

export const getActivePlan = findActivePlan;
export const createPlan = createWorkoutPlanRecord;
export const createSession = createWorkoutSession;
export const changeSessionStatus = updateWorkoutSession;
export const saveSessionLogs = replaceExerciseLogs;

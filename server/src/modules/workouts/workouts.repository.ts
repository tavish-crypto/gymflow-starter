import { db } from "../../db";

export async function findActivePlan(memberId: string) {
  return db.workoutPlan.findFirst({
    where: { memberId, status: "ACTIVE" },
    orderBy: { updatedAt: "desc" },
    include: {
      days: {
        orderBy: { sortOrder: "asc" },
        include: {
          exercises: {
            orderBy: { sortOrder: "asc" },
            include: { exercise: true },
          },
        },
      },
    },
  });
}

export async function createWorkoutPlanRecord(
  memberId: string,
  input: {
    createdById: string;
    name: string;
    goal: "FAT_LOSS" | "MUSCLE_GAIN" | "STRENGTH" | "GENERAL_FITNESS" | "MAINTENANCE";
    days: Array<{
      title: string;
      dayOfWeek: number;
      exercises: Array<{
        name: string;
        muscleGroup: string;
        equipment?: string;
        sets: number;
        reps: number;
        targetWeightKg?: number;
      }>;
    }>;
  }
) {
  return db.$transaction(async (tx) => {
    await tx.workoutPlan.updateMany({
      where: { memberId, status: "ACTIVE" },
      data: { status: "ARCHIVED" },
    });

    const plan = await tx.workoutPlan.create({
      data: {
        memberId,
        createdById: input.createdById,
        name: input.name,
        goal: input.goal,
        status: "ACTIVE",
      },
    });

    for (let dayIndex = 0; dayIndex < input.days.length; dayIndex += 1) {
      const dayInput = input.days[dayIndex];
      const day = await tx.workoutDay.create({
        data: {
          planId: plan.id,
          title: dayInput.title,
          dayOfWeek: dayInput.dayOfWeek,
          sortOrder: dayIndex,
        },
      });

      for (let exerciseIndex = 0; exerciseIndex < dayInput.exercises.length; exerciseIndex += 1) {
        const item = dayInput.exercises[exerciseIndex];
        const exercise = await tx.exercise.upsert({
          where: { name: item.name },
          update: { muscleGroup: item.muscleGroup, equipment: item.equipment },
          create: { name: item.name, muscleGroup: item.muscleGroup, equipment: item.equipment },
        });

        await tx.workoutExercise.create({
          data: {
            workoutDayId: day.id,
            exerciseId: exercise.id,
            sets: item.sets,
            reps: item.reps,
            targetWeightKg: item.targetWeightKg,
            sortOrder: exerciseIndex,
          },
        });
      }
    }

    return plan;
  });
}

export async function createWorkoutSession(memberId: string, workoutDayId: string | undefined, scheduledFor: Date) {
  return db.workoutSession.create({
    data: { memberId, workoutDayId, scheduledFor, status: "PLANNED" },
  });
}

export async function updateWorkoutSession(id: string, status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "SKIPPED") {
  const now = new Date();
  return db.workoutSession.update({
    where: { id },
    data: {
      status,
      startedAt: status === "IN_PROGRESS" ? now : undefined,
      endedAt: status === "COMPLETED" ? now : undefined,
    },
  });
}

export async function replaceExerciseLogs(
  sessionId: string,
  logs: Array<{ exerciseId: string; setNumber: number; weightKg?: number; reps?: number; completed: boolean }>
) {
  return db.$transaction(async (tx) => {
    await tx.exerciseLog.deleteMany({ where: { sessionId } });
    await tx.exerciseLog.createMany({
      data: logs.map((log) => ({ ...log, sessionId })),
    });
    return tx.workoutSession.findUnique({
      where: { id: sessionId },
      include: { exerciseLogs: { include: { exercise: true }, orderBy: { setNumber: "asc" } } },
    });
  });
}

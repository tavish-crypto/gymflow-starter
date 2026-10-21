import { Prisma } from "@prisma/client";
import { db } from "../../db";

export async function findMembers(search?: string, status?: string, trainerId?: string) {
  const where: Prisma.MemberProfileWhereInput = {};

  if (status && ["ACTIVE", "AT_RISK", "INACTIVE"].includes(status)) {
    where.status = status as "ACTIVE" | "AT_RISK" | "INACTIVE";
  }
  if (trainerId) where.trainerId = trainerId;
  if (search) {
    where.OR = [
      { user: { name: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  return db.memberProfile.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      trainer: { include: { user: { select: { name: true } } } },
      membership: true,
      progressEntries: { orderBy: { recordedAt: "desc" }, take: 1 },
    },
  });
}

export async function findMemberById(id: string) {
  return db.memberProfile.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      trainer: { include: { user: { select: { id: true, name: true, email: true } } } },
      membership: true,
      attendances: { orderBy: { checkIn: "desc" }, take: 30 },
      progressEntries: { orderBy: { recordedAt: "desc" }, take: 12 },
      workoutPlans: {
        where: { status: "ACTIVE" },
        take: 1,
        include: {
          days: {
            orderBy: { sortOrder: "asc" },
            include: { exercises: { include: { exercise: true }, orderBy: { sortOrder: "asc" } } },
          },
        },
      },
      nutritionGoal: true,
      workoutSessions: { orderBy: { scheduledFor: "desc" }, take: 30 },
    },
  });
}

export async function createMemberRecord(input: {
  gymId: string;
  name: string;
  email: string;
  goal: "FAT_LOSS" | "MUSCLE_GAIN" | "STRENGTH" | "GENERAL_FITNESS" | "MAINTENANCE";
  currentWeightKg?: number;
  targetWeightKg?: number;
  heightCm?: number;
  trainerId?: string;
  membershipPlan: string;
  membershipMonths: number;
}) {
  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + input.membershipMonths);

  return db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        gymId: input.gymId,
        name: input.name,
        email: input.email,
        role: "MEMBER",
      },
    });

    const member = await tx.memberProfile.create({
      data: {
        userId: user.id,
        trainerId: input.trainerId,
        goal: input.goal,
        currentWeightKg: input.currentWeightKg,
        targetWeightKg: input.targetWeightKg,
        heightCm: input.heightCm,
      },
    });

    await tx.membership.create({
      data: {
        gymId: input.gymId,
        memberId: member.id,
        planName: input.membershipPlan,
        startDate,
        endDate,
        status: "ACTIVE",
      },
    });

    return member;
  });
}

export async function findMemberHomeData(id: string) {
  const member = await db.memberProfile.findUnique({
    where: { id },
    include: {
      user: { select: { name: true } },
      nutritionGoal: true,
      workoutPlans: {
        where: { status: "ACTIVE" },
        take: 1,
        include: { days: { orderBy: { sortOrder: "asc" }, include: { exercises: true } } },
      },
      workoutSessions: {
        where: { scheduledFor: { gte: new Date(new Date().setHours(0, 0, 0, 0)) } },
        orderBy: { scheduledFor: "asc" },
        take: 7,
      },
    },
  });

  if (!member) return null;

  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date();
  dayEnd.setHours(23, 59, 59, 999);

  const [meals, events] = await Promise.all([
    db.mealLog.findMany({
      where: { memberId: id, eatenAt: { gte: dayStart, lte: dayEnd } },
      orderBy: { eatenAt: "asc" },
    }),
    db.calendarEvent.findMany({
      where: { memberId: id, startAt: { gte: dayStart, lte: dayEnd } },
      orderBy: { startAt: "asc" },
    }),
  ]);

  return { member, meals, events };
}

import { db } from "../../db";
import { addDays, endOfDay, startOfDay } from "../../utils/date";

export async function getAdminDashboardData() {
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const expiryWindow = addDays(now, 14);

  const [activeMembers, todayCheckins, expiringSoon, inactiveMembers, attention] =
    await Promise.all([
      db.memberProfile.count({ where: { status: "ACTIVE" } }),
      db.attendance.count({ where: { checkIn: { gte: todayStart, lte: todayEnd } } }),
      db.membership.count({
        where: {
          status: { in: ["ACTIVE", "EXPIRING"] },
          endDate: { gte: now, lte: expiryWindow },
        },
      }),
      db.memberProfile.count({ where: { status: { in: ["AT_RISK", "INACTIVE"] } } }),
      db.memberProfile.findMany({
        where: { status: { in: ["AT_RISK", "INACTIVE"] } },
        take: 4,
        orderBy: { updatedAt: "desc" },
        include: {
          user: { select: { name: true } },
          membership: { select: { status: true, endDate: true } },
        },
      }),
    ]);

  const sevenDaysAgo = startOfDay(addDays(now, -6));
  const attendanceRows = await db.attendance.findMany({
    where: { checkIn: { gte: sevenDaysAgo, lte: todayEnd } },
    select: { checkIn: true },
  });

  const attendanceByDay = Array.from({ length: 7 }, (_, index) => {
    const date = addDays(sevenDaysAgo, index);
    const key = date.toISOString().slice(0, 10);
    return {
      date: key,
      count: attendanceRows.filter((row) => row.checkIn.toISOString().slice(0, 10) === key).length,
    };
  });

  return {
    metrics: { activeMembers, todayCheckins, expiringSoon, inactiveMembers },
    attendanceByDay,
    attention: attention.map((member) => ({
      id: member.id,
      name: member.user.name,
      status: member.status,
      membershipStatus: member.membership?.status ?? null,
      membershipEndDate: member.membership?.endDate ?? null,
    })),
  };
}

export async function getFitnessManagerDashboardData() {
  const [underCoaching, needReview, withoutWorkoutPlan, lowAdherence, attention] =
    await Promise.all([
      db.memberProfile.count({ where: { trainerId: { not: null } } }),
      db.memberProfile.count({ where: { status: { in: ["AT_RISK", "INACTIVE"] } } }),
      db.memberProfile.count({ where: { workoutPlans: { none: { status: "ACTIVE" } } } }),
      db.memberProfile.count({ where: { status: "AT_RISK" } }),
      db.memberProfile.findMany({
        where: { status: { in: ["AT_RISK", "INACTIVE"] } },
        take: 6,
        include: {
          user: { select: { name: true } },
          trainer: { include: { user: { select: { name: true } } } },
        },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

  return {
    metrics: { underCoaching, needReview, withoutWorkoutPlan, lowAdherence },
    attention: attention.map((member) => ({
      id: member.id,
      name: member.user.name,
      status: member.status,
      goal: member.goal,
      trainerName: member.trainer?.user.name ?? null,
    })),
  };
}

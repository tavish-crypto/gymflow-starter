import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

function at(dayOffset: number, hour: number, minute = 0) {
  const date = new Date();
  date.setDate(date.getDate() + dayOffset);
  date.setHours(hour, minute, 0, 0);
  return date;
}

function monthsFromNow(months: number) {
  const date = new Date();
  date.setMonth(date.getMonth() + months);
  return date;
}

async function main() {
  await db.exerciseLog.deleteMany();
  await db.workoutSession.deleteMany();
  await db.workoutExercise.deleteMany();
  await db.workoutDay.deleteMany();
  await db.workoutPlan.deleteMany();
  await db.calendarEvent.deleteMany();
  await db.progressEntry.deleteMany();
  await db.mealLog.deleteMany();
  await db.nutritionGoal.deleteMany();
  await db.attendance.deleteMany();
  await db.membership.deleteMany();
  await db.memberProfile.deleteMany();
  await db.trainerProfile.deleteMany();
  await db.exercise.deleteMany();
  await db.user.deleteMany();
  await db.gym.deleteMany();

  const gym = await db.gym.create({ data: { name: "GymFlow Central" } });

  const admin = await db.user.create({
    data: { gymId: gym.id, name: "Aarav Admin", email: "admin@gymflow.local", role: "ADMIN" },
  });
  const manager = await db.user.create({
    data: { gymId: gym.id, name: "Meera Manager", email: "manager@gymflow.local", role: "FITNESS_MANAGER" },
  });

  const rahulUser = await db.user.create({
    data: { gymId: gym.id, name: "Rahul Sharma", email: "rahul@gymflow.local", role: "TRAINER" },
  });
  const priyaUser = await db.user.create({
    data: { gymId: gym.id, name: "Priya Verma", email: "priya@gymflow.local", role: "TRAINER" },
  });

  const rahul = await db.trainerProfile.create({
    data: { userId: rahulUser.id, specialization: "Strength & Fat Loss" },
  });
  const priya = await db.trainerProfile.create({
    data: { userId: priyaUser.id, specialization: "Hypertrophy & General Fitness" },
  });

  const memberSeeds = [
    { name: "Garvit Singh", email: "garvit@gymflow.local", goal: "FAT_LOSS" as const, trainerId: rahul.id, status: "ACTIVE" as const, weight: 82, target: 74, plan: "Premium" },
    { name: "Riya Mehta", email: "riya@gymflow.local", goal: "MUSCLE_GAIN" as const, trainerId: priya.id, status: "ACTIVE" as const, weight: 56, target: 60, plan: "Gold" },
    { name: "Aman Sharma", email: "aman@gymflow.local", goal: "FAT_LOSS" as const, trainerId: rahul.id, status: "AT_RISK" as const, weight: 91, target: 82, plan: "Standard" },
    { name: "Kunal Verma", email: "kunal@gymflow.local", goal: "STRENGTH" as const, trainerId: priya.id, status: "ACTIVE" as const, weight: 76, target: 78, plan: "Premium" },
    { name: "Neha Joshi", email: "neha@gymflow.local", goal: "GENERAL_FITNESS" as const, trainerId: priya.id, status: "INACTIVE" as const, weight: 64, target: 62, plan: "Gold" },
  ];

  const members: Record<string, { id: string; userId: string }> = {};

  for (let i = 0; i < memberSeeds.length; i += 1) {
    const seed = memberSeeds[i];
    const user = await db.user.create({
      data: { gymId: gym.id, name: seed.name, email: seed.email, role: "MEMBER" },
    });
    const member = await db.memberProfile.create({
      data: {
        userId: user.id,
        trainerId: seed.trainerId,
        goal: seed.goal,
        status: seed.status,
        currentWeightKg: seed.weight,
        targetWeightKg: seed.target,
        heightCm: 172 + i * 2,
        joinedAt: at(-60 - i * 10, 10),
      },
    });
    members[seed.name] = { id: member.id, userId: user.id };

    await db.membership.create({
      data: {
        gymId: gym.id,
        memberId: member.id,
        planName: seed.plan,
        startDate: at(-60, 9),
        endDate: i === 2 ? at(5, 9) : monthsFromNow(i === 4 ? 0 : 2 + i),
        status: i === 2 ? "EXPIRING" : i === 4 ? "PAUSED" : "ACTIVE",
      },
    });

    await db.progressEntry.createMany({
      data: [
        { memberId: member.id, weightKg: seed.weight + 1.2, recordedAt: at(-21, 8) },
        { memberId: member.id, weightKg: seed.weight + 0.5, recordedAt: at(-10, 8) },
        { memberId: member.id, weightKg: seed.weight, recordedAt: at(-1, 8) },
      ],
    });
  }

  // Attendance: enough history to make the dashboard useful.
  for (let day = -6; day <= 0; day += 1) {
    const activeNames = day % 2 === 0
      ? ["Garvit Singh", "Riya Mehta", "Kunal Verma"]
      : ["Garvit Singh", "Riya Mehta"];
    for (const [index, name] of activeNames.entries()) {
      await db.attendance.create({
        data: {
          memberId: members[name].id,
          checkIn: at(day, 7 + index, 15),
          checkOut: at(day, 8 + index, 20),
        },
      });
    }
  }

  const exerciseRows = await Promise.all([
    db.exercise.create({ data: { name: "Bench Press", muscleGroup: "Chest", equipment: "Barbell" } }),
    db.exercise.create({ data: { name: "Incline Dumbbell Press", muscleGroup: "Chest", equipment: "Dumbbells" } }),
    db.exercise.create({ data: { name: "Shoulder Press", muscleGroup: "Shoulders", equipment: "Dumbbells" } }),
    db.exercise.create({ data: { name: "Lat Pulldown", muscleGroup: "Back", equipment: "Cable" } }),
    db.exercise.create({ data: { name: "Squat", muscleGroup: "Legs", equipment: "Barbell" } }),
    db.exercise.create({ data: { name: "Romanian Deadlift", muscleGroup: "Hamstrings", equipment: "Barbell" } }),
  ]);
  const exerciseMap = Object.fromEntries(exerciseRows.map((exercise) => [exercise.name, exercise]));

  const garvitPlan = await db.workoutPlan.create({
    data: {
      memberId: members["Garvit Singh"].id,
      createdById: rahulUser.id,
      name: "4-Day Fat Loss Strength Plan",
      goal: "FAT_LOSS",
      status: "ACTIVE",
    },
  });

  const pushDay = await db.workoutDay.create({
    data: { planId: garvitPlan.id, title: "Push Day", dayOfWeek: new Date().getDay(), sortOrder: 0 },
  });
  const pullDay = await db.workoutDay.create({
    data: { planId: garvitPlan.id, title: "Pull Day", dayOfWeek: (new Date().getDay() + 2) % 7, sortOrder: 1 },
  });

  await db.workoutExercise.createMany({
    data: [
      { workoutDayId: pushDay.id, exerciseId: exerciseMap["Bench Press"].id, sets: 4, reps: 8, targetWeightKg: 62.5, sortOrder: 0 },
      { workoutDayId: pushDay.id, exerciseId: exerciseMap["Incline Dumbbell Press"].id, sets: 3, reps: 10, targetWeightKg: 24, sortOrder: 1 },
      { workoutDayId: pushDay.id, exerciseId: exerciseMap["Shoulder Press"].id, sets: 3, reps: 10, targetWeightKg: 18, sortOrder: 2 },
      { workoutDayId: pullDay.id, exerciseId: exerciseMap["Lat Pulldown"].id, sets: 4, reps: 10, targetWeightKg: 50, sortOrder: 0 },
      { workoutDayId: pullDay.id, exerciseId: exerciseMap["Romanian Deadlift"].id, sets: 3, reps: 8, targetWeightKg: 70, sortOrder: 1 },
    ],
  });

  // Workout history used for adherence.
  for (let index = 0; index < 5; index += 1) {
    await db.workoutSession.create({
      data: {
        memberId: members["Garvit Singh"].id,
        workoutDayId: index % 2 === 0 ? pushDay.id : pullDay.id,
        scheduledFor: at(-index * 2, 19),
        status: index === 4 ? "SKIPPED" : "COMPLETED",
        startedAt: index === 4 ? null : at(-index * 2, 19),
        endedAt: index === 4 ? null : at(-index * 2, 20),
      },
    });
  }

  await db.nutritionGoal.create({
    data: {
      memberId: members["Garvit Singh"].id,
      calories: 2100,
      proteinG: 140,
      carbsG: 240,
      fatG: 65,
      waterMl: 3000,
    },
  });

  await db.mealLog.createMany({
    data: [
      { memberId: members["Garvit Singh"].id, name: "Breakfast", calories: 420, proteinG: 24, carbsG: 58, fatG: 12, eatenAt: at(0, 8) },
      { memberId: members["Garvit Singh"].id, name: "Lunch", calories: 610, proteinG: 38, carbsG: 72, fatG: 20, eatenAt: at(0, 13) },
      { memberId: members["Garvit Singh"].id, name: "Protein Shake", calories: 180, proteinG: 25, carbsG: 10, fatG: 4, eatenAt: at(0, 17) },
    ],
  });

  await db.calendarEvent.createMany({
    data: [
      { memberId: members["Garvit Singh"].id, userId: members["Garvit Singh"].userId, type: "MEAL", title: "Breakfast", startAt: at(0, 8) },
      { memberId: members["Garvit Singh"].id, userId: members["Garvit Singh"].userId, type: "TRAINER_SESSION", title: "Trainer session", description: "Progress review with Rahul", startAt: at(0, 18) },
      { memberId: members["Garvit Singh"].id, userId: members["Garvit Singh"].userId, type: "WORKOUT", title: "Push Day", description: "6 exercises", startAt: at(0, 19), relatedId: pushDay.id },
      { memberId: members["Garvit Singh"].id, userId: members["Garvit Singh"].userId, type: "MEAL", title: "Dinner", startAt: at(0, 21) },
      { userId: rahulUser.id, memberId: members["Garvit Singh"].id, type: "PROGRESS_REVIEW", title: "Garvit progress review", startAt: at(0, 9) },
      { userId: rahulUser.id, memberId: members["Aman Sharma"].id, type: "TRAINER_SESSION", title: "Aman lower body session", startAt: at(0, 17) },
      { userId: rahulUser.id, type: "CLASS", title: "Strength class", startAt: at(0, 18, 30) },
    ],
  });

  console.log("GymFlow seed completed", {
    gymId: gym.id,
    adminId: admin.id,
    fitnessManagerId: manager.id,
    trainerId: rahul.id,
    memberId: members["Garvit Singh"].id,
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });

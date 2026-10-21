export type Role = "ADMIN" | "FITNESS_MANAGER" | "TRAINER" | "MEMBER";

export type DemoContext = {
  gym: { id: string; name: string } | null;
  admin: { id: string; name: string; email: string; role: Role } | null;
  manager: { id: string; name: string; email: string; role: Role } | null;
  trainer: { id: string; userId: string; user: { id: string; name: string; email: string } } | null;
  member: { id: string; userId: string; user: { id: string; name: string; email: string } } | null;
};

export type Member = {
  id: string;
  goal: string;
  status: "ACTIVE" | "AT_RISK" | "INACTIVE";
  currentWeightKg?: number | null;
  targetWeightKg?: number | null;
  heightCm?: number | null;
  joinedAt: string;
  user: { name: string; email: string };
  trainer?: { user: { name: string } } | null;
  membership?: { planName: string; status: string; endDate: string } | null;
  progressEntries?: Array<{ weightKg: number; recordedAt: string }>;
};

export type AdminDashboard = {
  metrics: {
    activeMembers: number;
    todayCheckins: number;
    expiringSoon: number;
    inactiveMembers: number;
  };
  attendanceByDay: Array<{ date: string; count: number }>;
  attention: Array<{
    id: string;
    name: string;
    status: string;
    membershipStatus: string | null;
    membershipEndDate: string | null;
  }>;
};

export type FitnessManagerDashboard = {
  metrics: {
    underCoaching: number;
    needReview: number;
    withoutWorkoutPlan: number;
    lowAdherence: number;
  };
  attention: Array<{
    id: string;
    name: string;
    status: string;
    goal: string;
    trainerName: string | null;
  }>;
};

export type TrainerDashboard = {
  trainer: { id: string; name: string };
  schedule: Array<CalendarEvent>;
  members: Array<{
    id: string;
    name: string;
    goal: string;
    status: string;
    adherence: number;
  }>;
};

export type CalendarEvent = {
  id: string;
  type: string;
  title: string;
  description?: string | null;
  startAt: string;
  endAt?: string | null;
  status: string;
};

export type WorkoutPlan = {
  id: string;
  name: string;
  goal: string;
  status: string;
  days: Array<{
    id: string;
    title: string;
    dayOfWeek: number;
    exercises: Array<{
      id: string;
      sets: number;
      reps: number;
      targetWeightKg?: number | null;
      exercise: { id: string; name: string; muscleGroup: string; equipment?: string | null };
    }>;
  }>;
};

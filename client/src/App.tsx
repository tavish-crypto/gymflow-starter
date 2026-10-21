import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { LoginPage } from "./pages/LoginPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { MembersPage } from "./pages/MembersPage";
import { MemberProfilePage } from "./pages/MemberProfilePage";
import { FitnessManagerPage } from "./pages/FitnessManagerPage";
import { TrainerDashboardPage } from "./pages/TrainerDashboardPage";
import { MemberHomePage } from "./pages/MemberHomePage";
import { WorkoutPage } from "./pages/WorkoutPage";
import { NutritionPage } from "./pages/NutritionPage";
import { CalendarPage } from "./pages/CalendarPage";
import { AICoachPage } from "./pages/AICoachPage";
import { WorkoutPlanPage } from "./pages/WorkoutPlanPage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<AppShell />}>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/members" element={<MembersPage />} />
        <Route path="/members/:id" element={<MemberProfilePage />} />
        <Route path="/member-profile" element={<MemberProfilePage />} />
        <Route path="/fitness-manager" element={<FitnessManagerPage />} />
        <Route path="/trainer" element={<TrainerDashboardPage />} />
        <Route path="/member" element={<MemberHomePage />} />
        <Route path="/workout" element={<WorkoutPage />} />
        <Route path="/nutrition" element={<NutritionPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/ai-coach" element={<AICoachPage />} />
        <Route path="/workout-plan" element={<WorkoutPlanPage />} />
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

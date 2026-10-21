import type { ElementType } from "react";
import {
  Apple,
  BarChart3,
  CalendarDays,
  Dumbbell,
  Home,
  LayoutDashboard,
  Salad,
  Sparkles,
  Users,
  UserRoundCog,
  WalletCards,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDemo } from "../context/DemoContext";
import type { Role } from "../api/types";
import { initials } from "../utils/format";

const roleNav: Record<Role, Array<{ to: string; label: string; icon: ElementType }>> = {
  ADMIN: [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { to: "/members", label: "Members", icon: Users },
    { to: "/calendar", label: "Calendar", icon: CalendarDays },
    { to: "/fitness-manager", label: "Fitness", icon: UserRoundCog },
  ],
  FITNESS_MANAGER: [
    { to: "/fitness-manager", label: "Overview", icon: LayoutDashboard },
    { to: "/members", label: "Members", icon: Users },
    { to: "/workout-plan", label: "Workout Plans", icon: Dumbbell },
    { to: "/calendar", label: "Calendar", icon: CalendarDays },
    { to: "/ai-coach", label: "AI Insights", icon: Sparkles },
  ],
  TRAINER: [
    { to: "/trainer", label: "Today", icon: Home },
    { to: "/members", label: "Members", icon: Users },
    { to: "/workout-plan", label: "Plans", icon: Dumbbell },
    { to: "/calendar", label: "Calendar", icon: CalendarDays },
  ],
  MEMBER: [
    { to: "/member", label: "Home", icon: Home },
    { to: "/workout", label: "Workout", icon: Dumbbell },
    { to: "/nutrition", label: "Nutrition", icon: Salad },
    { to: "/calendar", label: "Calendar", icon: CalendarDays },
    { to: "/member-profile", label: "Progress", icon: BarChart3 },
    { to: "/ai-coach", label: "AI Coach", icon: Sparkles },
  ],
};

export function AppShell() {
  const { role, setRole, currentName } = useDemo();
  const navigate = useNavigate();

  const changeRole = (next: Role) => {
    setRole(next);
    const destination =
      next === "ADMIN"
        ? "/admin"
        : next === "FITNESS_MANAGER"
          ? "/fitness-manager"
          : next === "TRAINER"
            ? "/trainer"
            : "/member";
    navigate(destination);
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-row">
          <div className="brand-mark"><Dumbbell size={18} /></div>
          <strong>GymFlow</strong>
        </div>

        <nav className="side-nav" aria-label="Primary navigation">
          {roleNav[role].map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <label className="role-label" htmlFor="role-switcher">Demo role</label>
          <select
            id="role-switcher"
            className="role-switcher"
            value={role}
            onChange={(event) => changeRole(event.target.value as Role)}
          >
            <option value="ADMIN">Admin</option>
            <option value="FITNESS_MANAGER">Fitness Manager</option>
            <option value="TRAINER">Trainer</option>
            <option value="MEMBER">Member</option>
          </select>

          <div className="profile-mini">
            <div className="avatar">{initials(currentName)}</div>
            <div>
              <strong>{currentName}</strong>
              <span>{role.replaceAll("_", " ").toLowerCase()}</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="search-box">Search members, trainers...</div>
          <div className="topbar-actions">
            <Apple size={18} />
            <WalletCards size={18} />
            <div className="avatar small">{initials(currentName)}</div>
          </div>
        </header>
        <div className="page-container">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

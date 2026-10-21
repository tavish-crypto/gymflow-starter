import { Dumbbell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDemo } from "../context/DemoContext";
import type { Role } from "../api/types";

export function LoginPage() {
  const { role, setRole } = useDemo();
  const navigate = useNavigate();

  const continueDemo = () => {
    const destination = role === "ADMIN" ? "/admin" : role === "FITNESS_MANAGER" ? "/fitness-manager" : role === "TRAINER" ? "/trainer" : "/member";
    navigate(destination);
  };

  return (
    <div className="login-page">
      <section className="login-panel">
        <div className="brand-row login-brand">
          <div className="brand-mark"><Dumbbell size={20} /></div>
          <strong>GymFlow</strong>
        </div>
        <div className="login-copy">
          <h1>Train smarter.<br />Manage better.</h1>
          <p>A complete gym operations and personal fitness platform.</p>
        </div>
        <label className="field-label" htmlFor="demo-role">Continue as</label>
        <select id="demo-role" value={role} onChange={(event) => setRole(event.target.value as Role)}>
          <option value="ADMIN">Admin</option>
          <option value="FITNESS_MANAGER">Fitness Manager</option>
          <option value="TRAINER">Trainer</option>
          <option value="MEMBER">Member</option>
        </select>
        <button className="primary-button full" onClick={continueDemo}>Enter demo</button>
        <p className="helper-text">Authentication is intentionally left as a replaceable demo layer.</p>
      </section>
      <section className="login-visual" aria-hidden="true">
        <div className="visual-orb one" />
        <div className="visual-orb two" />
        <div className="visual-card">
          <Dumbbell size={42} />
          <strong>Consistency compounds.</strong>
          <span>Simple tools for gym teams and members.</span>
        </div>
      </section>
    </div>
  );
}

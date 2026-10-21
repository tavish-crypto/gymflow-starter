import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createMember, getMembers, getTrainers } from "../api";
import type { Member } from "../api/types";
import { Badge, Card, ErrorState, LoadingState, PageHeader } from "../components/UI";
import { useDemo } from "../context/DemoContext";
import { formatGoal } from "../utils/format";

function toneForStatus(status: string): "green" | "amber" | "red" | "neutral" {
  if (status === "ACTIVE") return "green";
  if (status === "AT_RISK") return "amber";
  if (status === "INACTIVE") return "red";
  return "neutral";
}

export function MembersPage() {
  const { data: demo } = useDemo();
  const [members, setMembers] = useState<Member[] | null>(null);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", goal: "FAT_LOSS", currentWeightKg: "", targetWeightKg: "", heightCm: "", trainerId: "", membershipPlan: "Standard", membershipMonths: "3" });
  const navigate = useNavigate();

  async function loadMembers(value = search) {
    try { setMembers(await getMembers(value)); } catch (err) { setError(err instanceof Error ? err.message : "Unable to load members"); }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadMembers(search); }, 200);
    return () => window.clearTimeout(timer);
  }, [search]);

  useEffect(() => { getTrainers().then(setTrainers).catch(() => undefined); }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!demo?.gym?.id) return;
    try {
      await createMember({
        gymId: demo.gym.id,
        name: form.name,
        email: form.email,
        goal: form.goal,
        currentWeightKg: form.currentWeightKg ? Number(form.currentWeightKg) : undefined,
        targetWeightKg: form.targetWeightKg ? Number(form.targetWeightKg) : undefined,
        heightCm: form.heightCm ? Number(form.heightCm) : undefined,
        trainerId: form.trainerId || undefined,
        membershipPlan: form.membershipPlan,
        membershipMonths: Number(form.membershipMonths),
      });
      setShowAdd(false);
      setForm({ name: "", email: "", goal: "FAT_LOSS", currentWeightKg: "", targetWeightKg: "", heightCm: "", trainerId: "", membershipPlan: "Standard", membershipMonths: "3" });
      await loadMembers("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create member");
    }
  }

  return (
    <>
      <PageHeader title="Members" subtitle="Manage members without turning the page into a spreadsheet." action={<button className="primary-button" onClick={() => setShowAdd(true)}>+ Add member</button>} />
      {showAdd ? (
        <Card>
          <div className="section-heading"><div><h2>Add member</h2><p>Create the member, membership and trainer assignment together.</p></div><button className="text-button" onClick={() => setShowAdd(false)}>Cancel</button></div>
          <form className="member-form" onSubmit={submit}>
            <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <select value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}><option value="FAT_LOSS">Fat loss</option><option value="MUSCLE_GAIN">Muscle gain</option><option value="STRENGTH">Strength</option><option value="GENERAL_FITNESS">General fitness</option><option value="MAINTENANCE">Maintenance</option></select>
            <select value={form.trainerId} onChange={(e) => setForm({ ...form, trainerId: e.target.value })}><option value="">No trainer yet</option>{trainers.map((trainer) => <option value={trainer.id} key={trainer.id}>{trainer.user.name}</option>)}</select>
            <input placeholder="Current weight kg" inputMode="decimal" value={form.currentWeightKg} onChange={(e) => setForm({ ...form, currentWeightKg: e.target.value })} />
            <input placeholder="Target weight kg" inputMode="decimal" value={form.targetWeightKg} onChange={(e) => setForm({ ...form, targetWeightKg: e.target.value })} />
            <input placeholder="Height cm" inputMode="decimal" value={form.heightCm} onChange={(e) => setForm({ ...form, heightCm: e.target.value })} />
            <input required placeholder="Membership plan" value={form.membershipPlan} onChange={(e) => setForm({ ...form, membershipPlan: e.target.value })} />
            <input required placeholder="Months" inputMode="numeric" value={form.membershipMonths} onChange={(e) => setForm({ ...form, membershipMonths: e.target.value })} />
            <button className="primary-button" type="submit">Create member</button>
          </form>
        </Card>
      ) : null}
      <Card>
        <div className="toolbar-row">
          <input className="search-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search members..." />
          <select><option>All statuses</option></select>
          <select><option>All trainers</option></select>
        </div>
        {error ? <ErrorState message={error} /> : !members ? <LoadingState /> : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Goal</th><th>Trainer</th><th>Membership</th><th>Status</th></tr></thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} onClick={() => navigate(`/members/${member.id}`)} className="clickable-row">
                    <td><strong>{member.user.name}</strong><small>{member.user.email}</small></td>
                    <td>{formatGoal(member.goal)}</td>
                    <td>{member.trainer?.user.name ?? "Unassigned"}</td>
                    <td>{member.membership?.planName ?? "—"}</td>
                    <td><Badge tone={toneForStatus(member.status)}>{member.status.replace("_", " ")}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}

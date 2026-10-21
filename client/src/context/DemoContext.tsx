import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { DemoContext as DemoData, Role } from "../api/types";
import { getDemoContext } from "../api";

type DemoContextValue = {
  loading: boolean;
  error: string | null;
  data: DemoData | null;
  role: Role;
  setRole: (role: Role) => void;
  memberId?: string;
  trainerId?: string;
  currentName: string;
};

const Context = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DemoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [role, setRoleState] = useState<Role>(() => {
    return (localStorage.getItem("gymflow-role") as Role | null) ?? "MEMBER";
  });

  useEffect(() => {
    getDemoContext()
      .then(setData)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function setRole(next: Role) {
    localStorage.setItem("gymflow-role", next);
    setRoleState(next);
  }

  const value = useMemo<DemoContextValue>(() => {
    const currentName =
      role === "ADMIN"
        ? data?.admin?.name ?? "Admin"
        : role === "FITNESS_MANAGER"
          ? data?.manager?.name ?? "Fitness Manager"
          : role === "TRAINER"
            ? data?.trainer?.user.name ?? "Trainer"
            : data?.member?.user.name ?? "Member";

    return {
      data,
      loading,
      error,
      role,
      setRole,
      memberId: data?.member?.id,
      trainerId: data?.trainer?.id,
      currentName,
    };
  }, [data, error, loading, role]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useDemo() {
  const value = useContext(Context);
  if (!value) throw new Error("useDemo must be used inside DemoProvider");
  return value;
}

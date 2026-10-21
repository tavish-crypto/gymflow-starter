import { db } from "../../db";

export async function getDemoContext() {
  const [gym, admin, manager, trainer, member] = await Promise.all([
    db.gym.findFirst(),
    db.user.findFirst({ where: { role: "ADMIN" } }),
    db.user.findFirst({ where: { role: "FITNESS_MANAGER" } }),
    db.trainerProfile.findFirst({ include: { user: true } }),
    db.memberProfile.findFirst({ include: { user: true } }),
  ]);

  return { gym, admin, manager, trainer, member };
}

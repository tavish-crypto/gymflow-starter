import { Prisma } from "@prisma/client";
import { Request, Response } from "express";
import { createMemberSchema } from "./members.validation";
import { createMember, getMember, getMemberHome, getMembers } from "./members.service";

export async function listMembersController(req: Request, res: Response) {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const trainerId = typeof req.query.trainerId === "string" ? req.query.trainerId : undefined;
    res.json({ data: await getMembers(search, status, trainerId) });
  } catch (error) {
    console.error("List members failed", error);
    res.status(500).json({ error: "Unable to load members" });
  }
}

export async function memberDetailController(req: Request, res: Response) {
  try {
    const result = await getMember(req.params.id);
    if (!result.success) return res.status(404).json({ error: "Member not found" });
    res.json({ data: result });
  } catch (error) {
    console.error("Member detail failed", error);
    res.status(500).json({ error: "Unable to load member" });
  }
}

export async function memberHomeController(req: Request, res: Response) {
  try {
    const result = await getMemberHome(req.params.id);
    if (!result.success) return res.status(404).json({ error: "Member not found" });
    res.json({ data: result });
  } catch (error) {
    console.error("Member home failed", error);
    res.status(500).json({ error: "Unable to load member home" });
  }
}

export async function createMemberController(req: Request, res: Response) {
  const parsed = createMemberSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.flatten().fieldErrors });
  }

  try {
    const member = await createMember(parsed.data);
    res.status(201).json({ data: member });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return res.status(409).json({ error: "A user with this email already exists" });
    }
    console.error("Create member failed", error);
    res.status(500).json({ error: "Unable to create member" });
  }
}

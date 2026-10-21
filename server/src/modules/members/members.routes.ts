import { Router } from "express";
import {
  createMemberController,
  listMembersController,
  memberDetailController,
  memberHomeController,
} from "./members.controller";

export const membersRouter = Router();

membersRouter.get("/", listMembersController);
membersRouter.post("/", createMemberController);
membersRouter.get("/:id/home", memberHomeController);
membersRouter.get("/:id", memberDetailController);

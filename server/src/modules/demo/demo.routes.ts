import { Router } from "express";
import { demoContextController } from "./demo.controller";

export const demoRouter = Router();
demoRouter.get("/context", demoContextController);

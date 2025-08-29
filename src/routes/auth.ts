import { Router } from "express";
import * as AuthController from "../controllers/auth";
export const authRoutes = Router();

authRoutes.post("/signup", AuthController.SignUp);
// authRoutes.post("/signin", AuthController.SignIn);
// authRoutes.post("/validate", AuthController.Validate);

import { Router } from "express";
import * as mainController from "../controllers/main";

export const mainRoutes = Router();

mainRoutes.get("/ping", (req, res) => {
  res.status(200).json({ pong: "true" });
});

mainRoutes.get("/posts", mainController.getAllPosts);
// mainRoutes.get("/posts/:slug", mainController.getPost);
// mainRoutes.get("/posts/:slug/related", mainController.getRelatedPosts);

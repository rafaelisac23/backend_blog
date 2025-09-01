import { Router } from "express";
import * as adminController from "../controllers/admin";
import { privateRoute } from "../middlewares/private-route";
import { upload } from "../libs/multer";

export const adminRoutes = Router();

adminRoutes.post(
  "/posts",
  privateRoute,
  upload.single("cover"),
  adminController.addPost
);
// adminRoutes.get("/posts", adminController.getPosts);
// adminRoutes.get("/posts/:slug", adminController.getPost);
// adminRoutes.put("/posts/:slug", adminController.editPost);
// adminRoutes.delete("/posts/:slug", adminController.removePost);

import express from "express";
import UserController from "./user.controller.js";
import uploadFile from "../../middleware/fileupload.middleware.js";
import jwtAuth from "../../middleware/jwtAuth.middleware.js";

const userController = new UserController();

const userRoutes = express.Router();

userRoutes.post(
  "/signup",
  uploadFile.single("profilepicture"),
  (req, res, next) => {
    userController.singup(req, res, next);
  }
);

userRoutes.post("/signin", (req, res) => {
  userController.singin(req, res);
});

userRoutes.get("/get-details/:userId", jwtAuth, (req, res, next) => {
  userController.getUserDetails(req, res, next);
});

userRoutes.get("/get-all-details", jwtAuth, (req, res, next) => {
  userController.getAllUser(req, res, next);
});

userRoutes.put("/update-details/:userId", jwtAuth, (req, res, next) => {
  userController.updateUser(req, res, next);
});

userRoutes.post("/logout", jwtAuth, (req, res, next) => {
  userController.logout(req, res, next);
});

userRoutes.post("/logout-all-devices", jwtAuth, (req, res, next) => {
  userController.logoutAll(req, res, next);
});

export default userRoutes;

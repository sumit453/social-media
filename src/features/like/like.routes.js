import express from "express";
import LikeController from "./like.controller.js";

const likeRoutes = express.Router();
const likeController = new LikeController();

likeRoutes.post("/:id", (req, res, next) => {
  likeController.addLike(req, res, next);
});

likeRoutes.get("/:id", (req, res, next) => {
  likeController.getLikeForAPostOrComment(req, res, next);
});

likeRoutes.delete("/:likeId", (req, res, next) => {
  likeController.removeLike(req, res, next);
});

export default likeRoutes;

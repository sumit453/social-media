import express from "express";
import PostController from "./post.controller.js";
import uploadFile from "../../middleware/fileupload.middleware.js";

const postRoutes = express.Router();

const postController = new PostController();

postRoutes.post("/", uploadFile.single("imageUrl"), (req, res, next) => {
  postController.craetePost(req, res, next);
});

postRoutes.get("/all", (req, res, next) => {
  postController.getAllUserPost(req, res, next);
});

postRoutes.get("/", (req, res, next) => {
  postController.getAllPost(req, res, next);
});

postRoutes.get("/:postId", (req, res, next) => {
  postController.findOnePost(req, res, next);
});

postRoutes.get("/filterpost", (req, res, next) => {
  postController.filterPost(req, res, next);
});

postRoutes.delete("/:postId", (req, res, next) => {
  postController.deletePost(req, res, next);
});

postRoutes.put("/:postId", uploadFile.single("imageUrl"), (req, res, next) => {
  postController.editPost(req, res, next);
});

export default postRoutes;

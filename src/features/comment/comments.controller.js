import CommentRepository from "./comments.repository.js";

export default class CommentController {
  constructor() {
    this.commentRepository = new CommentRepository();
  }

  async addComment(req, res, next) {
    try {
      const userId = req.userId;
      const postId = req.params.postId;
      const comment = req.body.comment;
      const commentdata = await this.commentRepository.addCommentRepo(
        userId,
        postId,
        comment
      );
      return res.status(200).send(commentdata);
    } catch (err) {
      next(err);
    }
  }

  async deleteComment(req, res, next) {
    try {
      const commentId = req.params.commentId;
      await this.commentRepository.deleteCommentRepo(commentId);
      return res.status(200).send("Comment is deleted");
    } catch (err) {
      next(err);
    }
  }

  async updateComment(req, res, next) {
    try {
      const commentId = req.params.commentId;
      const comment = req.body.comment;

      const updatedComment = await this.commentRepository.updateCommentRepo(
        commentId,
        comment
      );
      return res.status(200).send(updatedComment);
    } catch (err) {
      next(err);
    }
  }

  async commentForAPost(req, res, next) {
    try {
      const postId = req.params.postId;
      const comment = await this.commentRepository.commentForAPostRepo(postId);
      return res.status(200).send(comment);
    } catch (err) {
      next(err);
    }
  }
}

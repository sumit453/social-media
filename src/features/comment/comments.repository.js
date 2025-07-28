import mongoose from "mongoose";
import ApplicationError from "../../error-handeler/applicationError.js";
import { ObjectId } from "mongodb";
import commentsSchemma from "./comments.schema.js";
import postSchema from "../post/post.schema.js";

const commentModel = mongoose.model("Comment", commentsSchemma);
const postModel = mongoose.model("Post", postSchema);

export default class CommentRepository {
  async addCommentRepo(userId, postId, comment) {
    try {
      const post = await postModel.findById(new ObjectId(postId));
      if (!post) {
        throw new ApplicationError("There is no such post", 404);
      }
      const commentData = new commentModel({
        user: new ObjectId(userId),
        comment: comment,
        post: new ObjectId(postId),
      });
      const saveComment = await commentData.save();
      post.comments.push(saveComment._id);
      await post.save();

      const filteredComment = {
        user: saveComment.user,
        comment: saveComment.comment,
        post: saveComment.post,
      };
      return filteredComment;
    } catch (err) {
      console.error("Add comment error is: ", err.message);
      throw new ApplicationError(
        err.message || "Some thing is wrong with database",
        500
      );
    }
  }

  async deleteCommentRepo(commentId) {
    try {
      const postDetail = await commentModel.findById(new ObjectId(commentId));
      if (!postDetail) {
        throw new ApplicationError("Comment is not found", 404);
      }
      const deleteComment = await commentModel.deleteOne({
        _id: new ObjectId(commentId),
        post: postDetail.post,
      });
      if (deleteComment.deletedCount == 0) {
        throw new ApplicationError("There is no such comment found", 404);
      }
      await postModel.findByIdAndUpdate(
        postDetail.post,
        {
          $pull: { comments: new ObjectId(commentId) },
        },
        { new: true }
      );
    } catch (err) {
      console.error("Delete comment error is: ", err.message);
      throw new ApplicationError(
        err.message || "Something is wrong with database",
        500
      );
    }
  }

  async updateCommentRepo(commentId, comment) {
    try {
      const commentData = await commentModel.findById(new ObjectId(commentId));
      if (!commentData) {
        throw new ApplicationError("No such comment found", 404);
      }
      commentData.comment = comment;
      const newComment = await commentData.save();

      const filteredComment = {
        user: newComment.user,
        comment: newComment.comment,
        post: newComment.post,
      };

      return filteredComment;
    } catch (err) {
      console.error("Update Comment error is: ", err.message);
      throw new ApplicationError(
        err.message || "Something is wrong with database",
        500
      );
    }
  }

  async commentForAPostRepo(postId) {
    try {
      const comment = await commentModel.findOne({
        post: new ObjectId(postId),
      });
      if (!comment) {
        throw new ApplicationError("Comment is not found", 404);
      }
      return comment;
    } catch (err) {
      console.error("Get a comment for a post error is: ", err.message);
      throw new ApplicationError(
        err.message || "Something is wrong with database",
        500
      );
    }
  }
}

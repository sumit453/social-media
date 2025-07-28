import mongoose from "mongoose";
import likeSchema from "./like.schema.js";
import { ObjectId } from "mongodb";
import ApplicationError from "../../error-handeler/applicationError.js";
import postSchema from "../post/post.schema.js";
import commentsSchemma from "../comment/comments.schema.js";

const likeModel = mongoose.model("Like", likeSchema);
const postModel = mongoose.model("Post", postSchema);
const commentModel = mongoose.model("Comment", commentsSchemma);

export default class LikeRepository {
  async addLikeRepo(userId, id) {
    try {
      let idDetails;
      let newLike;
      idDetails = await postModel.findById(new ObjectId(id));
      if (!idDetails) {
        idDetails = await commentModel.findById(new ObjectId(id));
        if (!idDetails) {
          throw new ApplicationError("Wrong input for a like", 404);
        }
        newLike = new likeModel({
          user: new ObjectId(userId),
          comment: idDetails._id,
        });
        const saveCommentLike = await newLike.save();
        idDetails.likes.push(saveCommentLike._id);
        idDetails.save();
        return;
      }
      newLike = new likeModel({
        user: new ObjectId(userId),
        post: idDetails._id,
      });
      const savePostLike = await newLike.save();
      idDetails.likes.push(savePostLike._id);
      idDetails.save();
      return;
    } catch (err) {
      console.error("Add like error is: ", err.message);
      throw new ApplicationError(
        err.message || "Something is wrong with database",
        500
      );
    }
  }

  async removeLikeRepo(likeId) {
    try {
      const likeData = await likeModel.findById(new ObjectId(likeId));
      if (!likeData) {
        throw new ApplicationError("Like is not found", 404);
      }
      const deleteLike = await likeModel.deleteOne({
        _id: new ObjectId(likeId),
      });
      if (deleteLike.deletedCount == 0) {
        throw new ApplicationError("Like is not found", 404);
      }
      if (!likeData.post && likeData.comment) {
        await commentModel.findByIdAndUpdate(
          likeData.comment,
          { $pull: { likes: new ObjectId(likeId) } },
          { new: true }
        );
      }
      if (!likeData.comment && likeData.post) {
        await postModel.findByIdAndUpdate(
          likeData.post,
          { $pull: { likes: new ObjectId(likeId) } },
          { new: true }
        );
      }
    } catch (err) {
      console.error("Remove like error is: ", err.message);
      throw new ApplicationError(
        err.message || "Something is wrong with database",
        500
      );
    }
  }

  async getLikeForAPostOrCommentRepo(id) {
    try {
      const like = await likeModel.findById(id);
      if (!like) {
        throw new ApplicationError("Like is not found", 404);
      }
      if (!like.post) {
        const likeData = { user: like.user, comment: like.comment };
        return likeData;
      }
      if (!like.comment) {
        const likeData = { user: like.user, post: like.post };
        return likeData;
      }
    } catch (err) {
      console.error("Get like for a post or comment error is: ", err.message);
      throw new ApplicationError(
        err.message || "Something is wrong with database",
        500
      );
    }
  }
}

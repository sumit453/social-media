import mongoose from "mongoose";
import ApplicationError from "../../error-handeler/applicationError.js";
import userSchema from "../users/user.schema.js";
import postSchema from "./post.schema.js";
import { ObjectId } from "mongodb";

const postModel = mongoose.model("Post", postSchema);
const userModel = mongoose.model("User", userSchema);

export default class PostRepository {
  async addPostRepo(postData, userId) {
    try {
      const newPost = new postModel(postData);
      const user = await userModel.findById(new ObjectId(userId));
      if (!user) {
        throw new ApplicationError("User is not found", 404);
      }
      const savePost = await newPost.save();
      user.posts.push(savePost._id);
      await user.save();
      return savePost;
    } catch (err) {
      console.error("Post error is: ", err.message);
      throw new ApplicationError(
        err.message || "Somethis is wrong with database",
        500
      );
    }
  }

  async getAllPostRepo(userId) {
    try {
      const allPost = await postModel.find({ user: new ObjectId(userId) });
      if (!allPost) {
        throw new ApplicationError("User have no post", 400);
      }
      return allPost;
    } catch (err) {
      console.error("Get all post error is: ", err.message);
      throw new ApplicationError(
        err.message || "Something is wrong with database",
        500
      );
    }
  }

  async findOnePostRepo(id, userId) {
    try {
      const result = await postModel.findOne({
        _id: new ObjectId(id),
        user: new ObjectId(userId),
      });
      if (!result) {
        throw new ApplicationError("No such post is available", 404);
      }
      return result;
    } catch (err) {
      console.error("Fine one post error is: ", err.message);
      throw new ApplicationError(
        err.message || "Something is wrong with database",
        500
      );
    }
  }

  async filterPostRepo(startDate, endDate, userId) {
    try {
      const filterInstence = {
        user: new ObjectId(userId),
      };
      if (startDate !== undefined || endDate !== undefined) {
        filterInstence.date = {};
      }
      if (startDate) {
        //convert date string to date object
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0); // Start of day
        filterInstence.date.$gte = start;
      }
      if (endDate) {
        //convert date string to date object
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); // End of day
        filterInstence.date.$lte = end;
      }

      // filterInstence.user = new ObjectId(userId);

      const result = await postModel.find(filterInstence);
      if (result.length == 0) {
        throw new ApplicationError("No post found for given date range", 404);
      }
      return result;
    } catch (err) {
      console.error("The filter post error is: ", err.message);
      throw new ApplicationError(
        err.message || "Something is wrong with database",
        500
      );
    }
  }

  async deletePostRepo(postId, userId) {
    try {
      const user = await userModel.findById(new ObjectId(userId));
      if (!user) {
        throw new ApplicationError("User is not found", 404);
      }
      const deletePost = await postModel.deleteOne({
        _id: new ObjectId(postId),
        user: new ObjectId(userId),
      });
      return deletePost.deletedCount > 0;
    } catch (err) {
      console.error("Delete post error is: ", err.message);
      throw new ApplicationError(
        err.message || "Something is wrong with database",
        500
      );
    }
  }

  async editPostRepo(postId, userId, caption, content, imageUrl) {
    try {
      const post = await postModel.findOne({
        _id: new ObjectId(postId),
        user: new ObjectId(userId),
      });
      if (!post) {
        throw new ApplicationError("Post is not found", 404);
      }
      if (caption) {
        post.caption = caption;
      }
      if (content) {
        post.content = content;
      }
      if (imageUrl) {
        post.imageUrl = imageUrl;
      }
      await post.save();
    } catch (err) {
      console.error("Edit post error is: ", err.message);
      throw new ApplicationError(
        err.message || "Something is wrong with database",
        500
      );
    }
  }

  async getAllPostFromAllUserRepo() {
    try {
      const posts = await postModel.find();
      if (!posts || posts.length == 0) {
        throw new ApplicationError("No post is found", 404);
      }
      return posts;
    } catch (err) {
      console.error("Get all user post error is: ", err.message);
      throw new ApplicationError(
        err.message || "Something is wrong with database",
        500
      );
    }
  }
}

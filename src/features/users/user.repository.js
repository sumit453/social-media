import mongoose from "mongoose";
import userSchema from "./user.schema.js";
import ApplicationError from "../../error-handeler/applicationError.js";
import { ObjectId } from "mongodb";

const UserModel = mongoose.model("User", userSchema);

export default class UserRepository {
  async signupRepo(userData) {
    try {
      const newUser = new UserModel(userData);
      await newUser.save();
      return newUser;
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        console.error("Signup mongoose validation error is: ", err.message);
        throw err;
      } else {
        console.error("Signup error is: ", err.message);
        throw new ApplicationError(
          err.message || "Some thing is wrong with database",
          500
        );
      }
    }
  }

  async findUserByEmail(email) {
    try {
      const user = await UserModel.findOne({ email: email });
      if (!user) {
        throw new ApplicationError("incorrect credentials", 404);
      }
      return user;
    } catch (err) {
      console.error("Signup error is: ", err.message);
    }
  }

  async getUserDetailsRepo(userId) {
    try {
      const user = await UserModel.findById(new ObjectId(userId));
      if (!user) {
        throw new ApplicationError("User is not found", 404);
      }
      return user;
    } catch (err) {
      console.error("get user details error is: ", err.message);
      throw new ApplicationError(
        err.message || "Something is wrong with database",
        500
      );
    }
  }

  async getAllUsersRepo() {
    try {
      const users = await UserModel.find();
      if (!users || users.length == 0) {
        throw new ApplicationError("There are no user found", 404);
      }
      const newList = [];
      users.map((user) => {
        newList.push({ name: user.name, age: user.age, gender: user.gender });
      });
      return newList;
    } catch (err) {
      console.error("Get all user error is: ", err.message);
      throw new ApplicationError(
        err.message || "Something is wrong with database",
        500
      );
    }
  }

  async updateUserDataRepo(userId, name, email, age, gender) {
    try {
      const user = await UserModel.findById(new ObjectId(userId));
      if (!user) {
        throw new ApplicationError("User is not found", 404);
      }
      if (name) {
        user.name = name;
      }
      if (email) {
        user.email = email;
      }
      if (age) {
        user.age = age;
      }
      if (gender) {
        user.gender = gender;
      }
      const upadteUser = await user.save();
      return upadteUser;
    } catch (err) {
      console.error("Update User data error is: ", err.message);
      throw new ApplicationError(
        err.message || "Something is wrong with database",
        500
      );
    }
  }

  async tokenVersionIncrement(userId) {
    try {
      const user = await UserModel.findByIdAndUpdate(
        new ObjectId(userId),
        { $inc: { tokenVersion: 1 } }, //increment token version by 1
        { new: true }
      );
      return user;
    } catch (err) {
      console.error("Token version increment error is: ", err.message);
      throw new ApplicationError("Token invalidation failde", 500);
    }
  }
}

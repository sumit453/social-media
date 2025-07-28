import mongoose from "mongoose";
import userSchema from "../users/user.schema.js";
import otpSchema from "./otp.schema.js";
import ApplicationError from "../../error-handeler/applicationError.js";
import EmailServiceForOTP from "../services/email.otp.services.js";
import { ObjectId } from "mongodb";
import otpRequestModel from "./otpRequest.schema.js";

const UserModel = mongoose.model("User", userSchema);
const OtpModel = mongoose.model("Otp", otpSchema);

export default class OtpRepository {
  async resetpasswordSendOtpRepo(userId) {
    try {
      const userData = await UserModel.findById(new ObjectId(userId));
      if (!userData) {
        throw new ApplicationError("User is not found", 404);
      }
      //check for requestes(should be max 3)
      const recentRequest = await otpRequestModel.countDocuments({
        userId: new ObjectId(userId),
        createdAt: { $gt: new Date(Date.now() - 60 * 60 * 1000) },
      });

      if (recentRequest >= 3) {
        throw new ApplicationError(
          "Too many requests, please try again later",
          429
        );
      }

      //Delete previous otp
      await OtpModel.deleteMany({ userId: new ObjectId(userId) });

      //create a rendom otp
      const otp = Math.floor(100000 + Math.random() * 900000);

      const otpData = new OtpModel({
        userId: new ObjectId(userId),
        userName: userData.name,
        otp: otp,
        email: userData.email,
        expiredAt: new Date(Date.now() + 60 * 1000),
      });
      await otpData.save();

      // Maintain the record of otp request
      const otpRequest = new otpRequestModel({ userId: new ObjectId(userId) });
      await otpRequest.save();

      await EmailServiceForOTP.sendOtp(userData.email, userData.name, otp);
    } catch (err) {
      console.error("Reset password otp send error is: ", err.message);
      throw new ApplicationError(
        err.message || "Something is wrong with otp send",
        500
      );
    }
  }

  async resetpasswordAproveOtpRepo(otp, userId, newPassword) {
    try {
      const userData = await UserModel.findById(new ObjectId(userId));
      if (!userData) {
        throw new ApplicationError("User is not found", 404);
      }
      const otpdata = await OtpModel.findOne({
        userId: new ObjectId(userId),
        userName: userData.name,
        otp: otp,
        email: userData.email,
        expiredAt: { $gt: new Date() }, // only non expired otp
      });
      if (!otpdata) {
        throw new ApplicationError("Enter a valid or nonexpired otp", 404);
      }

      userData.password = newPassword;

      const deleteOtp = await OtpModel.deleteOne({
        _id: new ObjectId(otpdata._id),
      });
      if (deleteOtp.deletedCount == 0) {
        throw new ApplicationError("Something is wrong please try again", 400);
      }
      await userData.save();
    } catch (err) {
      console.error("Resetpassword otp approve error is: ", err.message);
      throw new ApplicationError(
        err.message || "Something is wrong with Otp approve",
        500
      );
    }
  }

  async forgotPasswordRepo(email) {
    try {
      const user = await UserModel.findOne({ email: email });
      if (!user) {
        throw new ApplicationError("Something is wrong", 404);
      }
      await this.resetpasswordSendOtpRepo(user._id);
    } catch (err) {
      console.error("Forgot password error is: ", err.message);
      throw new ApplicationError(
        "Reset password for forgot password is failed",
        500
      );
    }
  }

  async frogotPasswordApproveRepo(otp, newPassword) {
    try {
      const otpData = await OtpModel.findOne({
        otp: otp,
        expiredAt: { $gt: new Date() },
      });

      if (!otpData) {
        throw new ApplicationError("Enter a valid or non expired otp", 401);
      }

      const user = await UserModel.findById(new ObjectId(otpData.userId));
      if (!user) {
        throw new ApplicationError("Invalid data", 404);
      }
      user.password = newPassword;

      const deleteOtp = await OtpModel.deleteMany({
        _id: new ObjectId(otpData._id),
      });
      if (deleteOtp.deletedCount == 0) {
        throw new ApplicationError("Something is wrong with database", 401);
      }
      user.save();
    } catch (err) {
      console.error("Forgot password approve error is: ", err.message);
      throw new ApplicationError("Reset password is failed", 500);
    }
  }
}

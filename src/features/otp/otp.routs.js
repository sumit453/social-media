import express from "express";
import OtpController from "./otp.controller.js";
import jwtAuth from "../../middleware/jwtAuth.middleware.js";

const otpRouts = express.Router();
const otpController = new OtpController();

otpRouts.post("/send", jwtAuth, (req, res, next) => {
  otpController.resetPasswordSendOtp(req, res, next);
});

otpRouts.post("/verify", jwtAuth, (req, res, next) => {
  otpController.resetPasswordApproveOtp(req, res, next);
});

otpRouts.post("/forgotPassword", (req, res, next) => {
  otpController.forgotPassword(req, res, next);
});

otpRouts.post("/forgotPasswordApprove", (req, res, next) => {
  otpController.forgotPasswordApprove(req, res, next);
});

export default otpRouts;

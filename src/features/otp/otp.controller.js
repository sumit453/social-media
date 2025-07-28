import OtpRepository from "./otp.repository.js";
import bcrypt from "bcrypt";

export default class OtpController {
  constructor() {
    this.otpRepository = new OtpRepository();
  }

  async resetPasswordSendOtp(req, res, next) {
    try {
      const userId = req.userId;

      await this.otpRepository.resetpasswordSendOtpRepo(userId);
      return res.status(200).send("Otp is send successfully");
    } catch (err) {
      next(err);
    }
  }

  async resetPasswordApproveOtp(req, res, next) {
    try {
      const userId = req.userId;
      const otp = req.body.otp;
      const password = req.body.password;
      const hasedPassword = await bcrypt.hash(password, 12);
      await this.otpRepository.resetpasswordAproveOtpRepo(
        otp,
        userId,
        hasedPassword
      );
      return res.status(200).send("Password is changed");
    } catch (err) {
      next(err);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const email = req.body.email;
      await this.otpRepository.forgotPasswordRepo(email);
      return res.status(200).send("Otp is send successfully");
    } catch (err) {
      next(err);
    }
  }

  async forgotPasswordApprove(req, res, next) {
    try {
      const otp = req.body.otp;
      const password = req.body.password;
      const hasedPassword = await bcrypt.hash(password, 12);
      await this.otpRepository.frogotPasswordApproveRepo(otp, hasedPassword);
      return res.status(200).send("Password is reset");
    } catch (err) {
      next(err);
    }
  }
}

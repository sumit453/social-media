import nodemailer from "nodemailer";
import ApplicationError from "../../error-handeler/applicationError.js";

export default class EmailServiceForOTP {
  static async sendOtp(email, name, otp) {
    const teansporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Password reset OTP`,
      html: `
            <h2>Deat ${name}</h2>
            <p>Your OTP for reset password is <strong>${otp}</strong></p>
            `,
    };

    try {
      await teansporter.sendMail(mailOptions);
      console.log("Otp is send succesfully");
    } catch (err) {
      console.error("Otp email error is: ", err.message);
      throw new ApplicationError(
        err.message || "Some thing is wrong with otp email",
        500
      );
    }
  }
}

import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "UserId is required"],
    ref: "User",
  },
  userName: { type: String, required: [true, "User name is required"] },
  otp: { type: Number, require: [true, "Otp is required"] },
  email: { type: String, required: [true, "Email is required"] },
  expiredAt: { type: Date, required: true, index: { expires: 0 } }, // index:{expires: 0 } automaticly delete the otp after the given time
});

export default otpSchema;

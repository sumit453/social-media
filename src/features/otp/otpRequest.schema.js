import mongoose from "mongoose";

const otpRequestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "user id is required"],
  },
  createdAt: { type: Date, default: Date.now, expires: "2h" }, // auto delete after 2 hours
});

const otpRequestModel = mongoose.model("OtpRequest", otpRequestSchema);

export default otpRequestModel;

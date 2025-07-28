import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema({
  token: { type: String, required: [true, "Token is required"], unique: true },
  expiredAt: {
    type: Date,
    require: [true, "Expired time is required"],
    index: { expires: 0 }, // Automatically delete when expiresAt is reached,
  },
});

export default blacklistSchema;

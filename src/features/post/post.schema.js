import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  caption: { type: String, required: [true, "Caption is required"] },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
  content: { type: String, required: [true, "Content is required"] },
  imageUrl: { type: String },
  date: { type: Date, required: [true, "Date is required"], default: Date.now },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

export default postSchema;

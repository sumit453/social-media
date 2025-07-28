import mongoose from "mongoose";

const commentsSchemma = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "User is required"],
    ref: "User",
  },
  comment: { type: String, required: [true, "comment can not be empty"] },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Post Id can not be empty"],
    ref: "Post",
  },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
});

export default commentsSchemma;

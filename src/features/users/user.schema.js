import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  email: {
    type: String,
    unique: [true, "This email is already listed"],
    required: [true, "Email is required"],
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  profilepicture: { type: String },
  age: { type: Number, required: [true, "age is required"] },
  gender: { type: String, required: [true, "Gender is required"] },

  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  friendRequestSend: [{ type: mongoose.Schema.Types.ObjectId, ref: "Friend" }], // store the id of friend request
  friendRequestRecived: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Friend" }, //store the id of friend request
  ],
  tokenVersion: { type: Number, default: 0 },
});

// userSchema.index({ email: 1 }, { unique: true });
// userSchema.index({ name: 1 });

export default userSchema;

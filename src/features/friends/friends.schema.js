import mongoose from "mongoose";

const friendsSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  senderEmail: { type: String, required: [true, "sender email is required"] },
  reciver: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  reciverEmail: { type: String, required: [true, "Reciver email is required"] },
  status: {
    type: String,
    default: "Panding",
    enum: ["pending", "accepted", "rejected"],
  },
});

export default friendsSchema;

// name: String,

//   email: String,

//   friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

//   sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

//   receivedRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

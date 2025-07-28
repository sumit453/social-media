import mongoose from "mongoose";

const connectUsingMongoose = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Mongodb using mongoose is connected");
  } catch (err) {
    console.error("mongoose connection error is: ", err.message);
  }
};

export default connectUsingMongoose;

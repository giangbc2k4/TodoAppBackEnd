import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONECTIONSTRING);
    console.log("ket noi thanh cong");
  } catch (error) {
    console.log("ket noi k thanh cong", error);
    process.exit(1);
  }
};

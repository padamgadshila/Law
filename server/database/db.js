import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const connect = async () => {
  const url = process.env.DB;
  // const db = await mongoose.connect(url);
  const db = await mongoose.connect("mongodb://127.0.0.1:27017/law");

  console.log("Database connected");

  return db;
};

export default connect;

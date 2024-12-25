import mongoose from "mongoose";

const connect = async () => {
  const db = await mongoose.connect("mongodb://127.0.0.1:27017/law");

  console.log("Database connected");

  return db;
};

export default connect;

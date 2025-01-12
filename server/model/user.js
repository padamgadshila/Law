import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fname: { type: String },
    lname: { type: String },
    mobile: { type: String },
    role: { type: String, enum: ["admin", "employee"], required: true },
    profilePic: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

export default User;

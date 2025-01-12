import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "client",
      required: true,
      unique: true,
    },
    document: {},
    info: { type: String },
  },
  { timestamps: true }
);

const Files = mongoose.model("file", fileSchema);

export default Files;

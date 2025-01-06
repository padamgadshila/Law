import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "client",
    required: true,
    unique: true,
  },
  document: {},
  info: { type: String },
  uploadedAt: { type: Date, default: Date.now },
});

const Files = mongoose.model("file", fileSchema);

export default Files;

import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String },
    date: { type: String },
    time: { type: String },
  },
  { timestamps: true }
);

const Event = mongoose.model("event", eventSchema);

export default Event;

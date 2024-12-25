import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
  userId: {
    type: new mongoose.Schema.Types.ObjectId(),
    ref: "client",
    required: true,
  },
  documentType: {
    type: String,
    enum: ["Id", "Pan Card", "Aadhar Card", "Passport", "Driving License"], // Add more options as needed
    required: true,
  },
  filePath: { type: String, required: true },
  originalName: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

const Files = mongoose.model("file", fileSchema);

export default Files;

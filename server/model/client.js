import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  docNo: { type: String },
  fname: { type: String },
  mname: { type: String },
  lname: { type: String },
  email: { type: String },
  mobile: { type: String },
  caseType: { type: String },
  dob: { type: String },
  address: {
    city: { type: String },
    village: { type: String },
    pincode: { type: String },
  },
  status: { type: String },
  fileUploaded: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Client = mongoose.model("client", clientSchema);

export default Client;

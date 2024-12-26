import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  cid: { type: String },
  fname: { type: String },
  mname: { type: String },
  lname: { type: String },
  email: { type: String },
  mobile: { type: String },
  caseType: { type: String },
  address: {
    city: { type: String },
    pincode: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

const Client = mongoose.model("client", clientSchema);

export default Client;

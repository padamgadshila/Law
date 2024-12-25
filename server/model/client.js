import mongoose from "mongoose";

const clientSchema = new mongoose.Schema({
  clientId: { type: String },
  fname: { type: String },
  mname: { type: String },
  lname: { type: String },
  email: { type: String },
  mobile: { type: String },
  address: {
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
});

const Client = mongoose.model("client", clientSchema);

export default Client;

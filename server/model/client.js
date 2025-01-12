import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    docNo: { type: String },
    fname: { type: String },
    mname: { type: String },
    lname: { type: String },
    email: { type: String },
    mobile: { type: String },
    caseType: { type: String },
    docType: { type: String },
    dob: { type: String },
    gender: { type: String },
    address: {
      state: { type: String },
      city: { type: String },
      village: { type: String },
      pincode: { type: String },
    },
    status: { type: String },
    fileUploaded: { type: String },
    hide: { type: Boolean },
  },
  { timestamps: true }
);

const docNoCounterSchema = new mongoose.Schema({
  sequenceValue: { type: Number, default: 0 },
});

export const DocNoCounter = mongoose.model("DocNoCounter", docNoCounterSchema);

clientSchema.pre("save", async function (next) {
  if (!this.docNo) {
    try {
      const counter = await DocNoCounter.findOneAndUpdate(
        {},
        { $inc: { sequenceValue: 1 } },
        { new: true, upsert: true }
      );

      this.docNo = `DOC${String(counter.sequenceValue).padStart(3, "0")}`;
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Client = mongoose.model("client", clientSchema);

export default Client;

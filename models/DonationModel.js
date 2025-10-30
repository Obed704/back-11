import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  name: { type: String },
  email: { type: String },
  message: { type: String },
  method: { type: String, enum: ["stripe", "paypal"], required: true },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Donation", donationSchema);

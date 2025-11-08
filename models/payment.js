import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  amount: { type: Number, required: true },
  message: { type: String },
  provider: { type: String, enum: ["stripe", "paypal"], required: true },
  type: { type: String, enum: ["one-time", "monthly"], required: true },
}, { timestamps: true });

export default mongoose.model("Payment", paymentSchema);

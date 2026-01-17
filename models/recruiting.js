// models/ProcessStep.js
import mongoose from "mongoose";

const processStepSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  img: { type: String, required: true },
  alt: { type: String, required: true },
  highlight: { type: String, default: "" },
});

const ProcessStep = mongoose.model("ProcessStep", processStepSchema);
export default ProcessStep;

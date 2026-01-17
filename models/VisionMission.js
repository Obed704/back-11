import mongoose from "mongoose";

const MissionVisionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  borderColor: { type: String, default: "border-blue-600" },
  shadowColor: { type: String, default: "hover:shadow-blue-400/50" },
});

export default mongoose.model("MissionVision", MissionVisionSchema);

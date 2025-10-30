import mongoose from "mongoose";

const championSchema = new mongoose.Schema({
  title: { type: String, required: true },
  season: { type: String, required: true },
  description: { type: String, required: true },
  roadToVictory: { type: String, required: true },
  image: { type: String },
  alt: { type: String },
  showHeader: { type: Boolean, default: true }
});

export default mongoose.model("Champion", championSchema);

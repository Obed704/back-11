import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  embedUrl: String,
});

export default mongoose.model("Video", videoSchema);

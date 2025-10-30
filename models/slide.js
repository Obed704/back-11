// backend/models/Slide.js
import mongoose from "mongoose";

const slideSchema = new mongoose.Schema({
  bg: { type: String, required: true }, // image path or URL
});

const Slide = mongoose.model("slide", slideSchema);

export default Slide;

// backend/models/testimonialModel.js
import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  text: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, default: "" },
  font: { type: String, default: "'Inter', sans-serif" }, // optional font CSS-family string
  borderColor: { type: String, default: "#60a5fa" },
  textColor: { type: String, default: "#ffffff" },
}, { timestamps: true });

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
export default Testimonial;

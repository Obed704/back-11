import mongoose from "mongoose";

const educationElementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  img: { type: String, required: true }, // URL from Cloudinary
  alt: { type: String },
  borderColor: { type: String, default: "border-indigo-500" },
}, { timestamps: true });

const EducationElement = mongoose.model("EducationElement", educationElementSchema);
export default EducationElement;
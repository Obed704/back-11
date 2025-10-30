import mongoose from "mongoose";

const educationElementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  img: { type: String, required: true },
  alt: { type: String },
  borderColor: { type: String },
});

const EducationElement = mongoose.model("EducationElement", educationElementSchema);
export default EducationElement;

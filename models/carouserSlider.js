import mongoose from "mongoose";

const projectSlideSchema = new mongoose.Schema({
  src: { type: String, required: true },
  alt: { type: String },
  caption: { type: String },
});

const ProjectSlide = mongoose.model("ProjectSlide", projectSlideSchema);
export default ProjectSlide;

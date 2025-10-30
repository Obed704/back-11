// backend/models/galleryModel.js
import mongoose from "mongoose";

const gallerySchema = new mongoose.Schema({
  image: { type: String, required: true }, // e.g. "/championsImage/abc.jpg"
  alt: { type: String, default: "Gallery Image" },
  title: { type: String, default: "" },
}, { timestamps: true });

const GalleryImage = mongoose.model("GalleryImage", gallerySchema);
export default GalleryImage;

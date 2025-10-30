import mongoose from "mongoose";

const downloadSchema = new mongoose.Schema({
  title: String,
  description: String,
  linkText: String,
  linkHref: String,
  fileType: String,
  fileSize: String,
  image: String,
  alt: String,
});

export default mongoose.model("Download", downloadSchema);

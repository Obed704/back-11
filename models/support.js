import mongoose from "mongoose";

const supportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  linkText: { type: String, required: true },
  linkHref: { type: String, required: true },
  image: { type: String, required: true },
  alt: { type: String, required: true },
});

const Support = mongoose.model("Support", supportSchema);
export default Support;

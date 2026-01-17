// backend/models/SectionText.js
import mongoose from "mongoose";

const sectionTextSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: [
      {
        text: { type: String, required: true },
        highlight: { type: Boolean, default: false }, // true = cyan color
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("SectionText", sectionTextSchema);

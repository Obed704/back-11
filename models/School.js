// backend/models/School.js
import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    img: { type: String, required: true },
    location: { type: String, required: true },
website: { type: String, required: false, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("School", schoolSchema);

import mongoose from "mongoose";

const fllSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },        // e.g., "FIRST LEGO League"
    description: { type: String, required: true },
    logo: { type: String, required: true },         // path to image
    mapUrl: { type: String },                       // optional map embed URL
  },
  { timestamps: true }
);

export default mongoose.model("FLL", fllSchema);

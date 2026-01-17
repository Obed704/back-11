import mongoose from "mongoose";

const FtcLandingSchema = new mongoose.Schema(
  {
    hero: {
      titlePrefix: { type: String, default: "Introducing" },
      titleHighlight: { type: String, default: "FIRST Tech Challenge" },
      subtitle: { type: String },
      backgroundImage: { type: String },
      ctaText: { type: String },
      ctaLink: { type: String },
    },

    about: {
      title: { type: String },
      description: { type: String },
      image: { type: String },
      linkText: { type: String },
      linkUrl: { type: String },
    },

    schoolsSection: {
      title: { type: String },
      ctaText: { type: String },
      ctaLink: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model("FtcLanding", FtcLandingSchema);

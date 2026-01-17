import mongoose from "mongoose";

const HeroButtonSchema = new mongoose.Schema({
  label: String,
  link: String,
  type: {
    type: String,
    enum: ["primary", "secondary"],
    default: "primary",
  },
});

const HeroSettingsSchema = new mongoose.Schema(
  {
    title: {
      word1: { type: String, default: "STEM" },
      word2: { type: String, default: "Inspires" },
    },

    subtitle: {
      type: String,
      default:
        "Inspiring the next generation of innovators through inclusive, exciting, and hands-on robotics curriculums.",
    },

    logoImage: {
      type: String,
      default: "hero-logo.png",
    },

    buttons: [HeroButtonSchema],

    colorPalette: {
      type: [String],
      default: [
        "rgb(247, 244, 46)",
        "rgb(23, 207, 220)",
        "rgb(242, 30, 167)",
      ],
    },

    colorMode: {
      type: String,
      enum: ["random-once", "random-per-slide", "fixed"],
      default: "random-once",
    },

    slideInterval: {
      type: Number,
      default: 7000,
    },
  },
  { timestamps: true }
);

export default mongoose.model("HeroSettings", HeroSettingsSchema);

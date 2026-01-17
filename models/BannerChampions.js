// models/Banner.js
import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  primaryColor: { type: String, default: "rgb(23, 207, 220)" }, // RGB or HEX
  secondaryColor: { type: String, default: "#ffffff" },
  backgroundColor: { type: String, default: "#000000" },
  image: { type: String, required: false }, // to be set from /api/champions
});

const Banner = mongoose.model("Banner", bannerSchema);
export default Banner;

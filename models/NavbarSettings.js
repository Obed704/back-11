import mongoose from "mongoose";

const NavLinkSchema = new mongoose.Schema({
  name: String,
  link: String,
});

const NavbarSettingsSchema = new mongoose.Schema(
  {
    textColor: { type: String, default: "text-white" },
    hoverColor: { type: String, default: "#f7f42e" },

    logoMode: {
      type: String,
      enum: ["logo-only", "logo-with-text"],
      default: "logo-with-text",
    },

    logoImage: {
      type: String,
      default: "default-logo.png", // fallback
    },

    links: [NavLinkSchema],
  },
  { timestamps: true }
);

export default mongoose.model("NavbarSettings", NavbarSettingsSchema);

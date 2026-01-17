import express from "express";
import NavbarSettings from "../models/NavbarSettings.js";
import uploadLogo from "../multer/uploadLogo.js";

const router = express.Router();

// Get navbar settings
router.get("/", async (req, res) => {
  const navbar = await NavbarSettings.findOne();
  res.json(navbar);
});

// Update navbar settings (text, mode, colors)
router.put("/", async (req, res) => {
  const updated = await NavbarSettings.findOneAndUpdate(
    {},
    req.body,
    { new: true, upsert: true }
  );
  res.json(updated);
});

// Upload logo
router.post(
  "/upload-logo",
  uploadLogo.single("logo"),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const updated = await NavbarSettings.findOneAndUpdate(
      {},
      { logoImage: req.file.filename },
      { new: true, upsert: true }
    );

    res.json({
      message: "Logo uploaded",
      logo: req.file.filename,
      navbar: updated,
    });
  }
);

export default router;

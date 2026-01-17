import express from "express";
import HeroSettings from "../models/heroSettings.js";
import upload from "../multer/uploadLogo.js"; // reuse multer

const router = express.Router();

// Get hero config
router.get("/", async (req, res) => {
  const hero = await HeroSettings.findOne();
  res.json(hero);
});

// Update hero config
router.put("/", async (req, res) => {
  const updated = await HeroSettings.findOneAndUpdate(
    {},
    req.body,
    { new: true, upsert: true }
  );
  res.json(updated);
});

// Upload hero logo
router.post("/upload-logo", upload.single("logo"), async (req, res) => {
  const updated = await HeroSettings.findOneAndUpdate(
    {},
    { logoImage: req.file.filename },
    { new: true, upsert: true }
  );
  res.json(updated);
});

export default router;

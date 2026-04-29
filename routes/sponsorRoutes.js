import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js"; // Reuse your existing config
import Sponsor from "../models/sponsors.js";

const router = express.Router();

// 1. Configure Cloudinary Storage for Sponsors
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "stem-inspires/sponsors", // Organized subfolder
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, crop: "limit" }], // Optional: resize for consistency
    public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
  }),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// CREATE sponsor
router.post("/", upload.single("img"), async (req, res) => {
  try {
    const { name, description, gradient, btnColor } = req.body;
    const sponsor = new Sponsor({
      name,
      description,
      gradient,
      btnColor,
      // Cloudinary returns the full URL in req.file.path
      img: req.file ? req.file.path : "",
    });
    const savedSponsor = await sponsor.save();
    res.status(201).json(savedSponsor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE sponsor
router.put("/:id", upload.single("img"), async (req, res) => {
  try {
    const updateData = { ...req.body };
    // If a new file is uploaded, use the new Cloudinary URL
    if (req.file) updateData.img = req.file.path;

    const updatedSponsor = await Sponsor.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(updatedSponsor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE, GET routes remain the same...
router.delete("/:id", async (req, res) => {
  try {
    // Optional: Add logic here to destroy the image on Cloudinary using cloudinary.uploader.destroy()
    await Sponsor.findByIdAndDelete(req.params.id);
    res.json({ message: "Sponsor deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const sponsors = await Sponsor.find();
    res.json(sponsors);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;
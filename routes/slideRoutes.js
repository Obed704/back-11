import express from "express";
import Slide from "../models/slide.js";
import { protect } from "../middleware/authMidleware.js";
import multer from "multer";
import path from "path";

const router = express.Router();

/* Multer storage */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/welcomeSlide");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `slide-${Date.now()}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image")) {
      cb(new Error("Only images allowed"));
    }
    cb(null, true);
  },
});

/* PUBLIC — Get all slides */
router.get("/", async (req, res) => {
  try {
    const slides = await Slide.find().sort({ createdAt: -1 });
    res.json(slides);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

/* ADMIN — Upload & add slide */
router.post("/", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Image required" });

    const slide = await Slide.create({
      bg: `/welcomeSlide/${req.file.filename}`,
    });

    res.status(201).json(slide);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

/* ADMIN — Update slide image */
router.put("/:id", protect, upload.single("image"), async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ message: "Image required" });

    const slide = await Slide.findByIdAndUpdate(
      req.params.id,
      { bg: `/welcomeSlide/${req.file.filename}` },
      { new: true }
    );

    res.json(slide);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

/* ADMIN — Delete slide */
router.delete("/:id", protect, async (req, res) => {
  try {
    await Slide.findByIdAndDelete(req.params.id);
    res.json({ message: "Slide removed" });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

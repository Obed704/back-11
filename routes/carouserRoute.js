// backend/routes/projectSlideRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import ProjectSlide from "../models/carouserSlider.js";

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/our-project-SLIDE"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// GET all slides
router.get("/", async (req, res) => {
  try {
    const slides = await ProjectSlide.find();
    res.json(slides);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE new slide
router.post("/", upload.single("src"), async (req, res) => {
  try {
    const { alt, caption } = req.body;
    if (!req.file) return res.status(400).json({ message: "Image file required" });

    const slide = new ProjectSlide({
      src: `/our-project-SLIDE/${req.file.filename}`,
      alt,
      caption,
    });
    await slide.save();
    res.status(201).json(slide);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE slide
router.put("/:id", upload.single("src"), async (req, res) => {
  try {
    const slide = await ProjectSlide.findById(req.params.id);
    if (!slide) return res.status(404).json({ message: "Slide not found" });

    const { alt, caption } = req.body;
    if (alt) slide.alt = alt;
    if (caption) slide.caption = caption;
    if (req.file) slide.src = `/our-project-SLIDE/${req.file.filename}`;

    await slide.save();
    res.json(slide);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE slide
router.delete("/:id", async (req, res) => {
  try {
    await ProjectSlide.findByIdAndDelete(req.params.id);
    res.json({ message: "Slide deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

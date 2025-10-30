// backend/routes/slideRoutes.js
import express from "express";
import Slide from "../models/slide.js";
import { protect } from "../middleware/authMidleware.js";

const router = express.Router();

// Public: get all slides
router.get("/", async (req, res) => {
  try {
    const slides = await Slide.find();
    res.json(slides);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Admin only: add slide
router.post("/", protect, async (req, res) => {
  try {
    const { bg } = req.body;
    const slide = new Slide({ bg });
    await slide.save();
    res.status(201).json(slide);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Admin only: delete slide
router.delete("/:id", protect, async (req, res) => {
  try {
    await Slide.findByIdAndDelete(req.params.id);
    res.json({ message: "Slide removed" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;

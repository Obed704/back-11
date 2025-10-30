// backend/routes/testimonialsRoutes.js
import express from "express";
import Testimonial from "../models/Comments.js";

const router = express.Router();

// GET all testimonials (sorted newest first)
router.get("/", async (req, res) => {
  try {
    const items = await Testimonial.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// CREATE new testimonial
router.post("/", async (req, res) => {
  try {
    const { text, name, role, font, borderColor, textColor } = req.body;
    if (!text || !name) return res.status(400).json({ message: "text and name are required" });

    const newItem = new Testimonial({ text, name, role, font, borderColor, textColor });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ message: "Failed to create", error: err.message });
  }
});

// UPDATE testimonial
router.put("/:id", async (req, res) => {
  try {
    const updates = req.body;
    const updated = await Testimonial.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update", error: err.message });
  }
});

// DELETE testimonial
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Testimonial.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete", error: err.message });
  }
});

export default router;

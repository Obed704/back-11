import express from "express";
import FLL from "../models/Fll.js";

const router = express.Router();

// GET all
router.get("/", async (req, res) => {
  try {
    const flls = await FLL.find().sort({ createdAt: -1 });
    res.json(flls);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET by ID
router.get("/:id", async (req, res) => {
  try {
    const fll = await FLL.findById(req.params.id);
    if (!fll) return res.status(404).json({ message: "Not found" });
    res.json(fll);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const { title, description, logo, mapUrl } = req.body;
    const fll = new FLL({ title, description, logo, mapUrl });
    await fll.save();
    res.status(201).json(fll);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const { title, description, logo, mapUrl } = req.body;
    const fll = await FLL.findByIdAndUpdate(
      req.params.id,
      { title, description, logo, mapUrl },
      { new: true }
    );
    if (!fll) return res.status(404).json({ message: "Not found" });
    res.json(fll);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const fll = await FLL.findByIdAndDelete(req.params.id);
    if (!fll) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

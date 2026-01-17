import express from "express";
import Support from "../models/support.js";
import upload from "../multer/uploadSupport.js"; // reuse multer setup for image uploads

const router = express.Router();

// GET all support cards
router.get("/", async (req, res) => {
  try {
    const supports = await Support.find();
    res.json(supports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new support card
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const newSupport = new Support({
      ...req.body,
      image: req.file ? `/support/${req.file.filename}` : req.body.image,
    });
    await newSupport.save();
    res.json(newSupport);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update support card
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updated = await Support.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        ...(req.file && { image: `/support/${req.file.filename}` }),
      },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE support card
router.delete("/:id", async (req, res) => {
  try {
    await Support.findByIdAndDelete(req.params.id);
    res.json({ message: "Support card deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

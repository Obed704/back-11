// backend/routes/missionVisionRoutes.js
import express from "express";
import MissionVision from "../models/VisionMission.js";

const router = express.Router();

// GET all mission/vision entries
router.get("/", async (req, res) => {
  try {
    const items = await MissionVision.find({});
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET a single mission/vision entry by ID
router.get("/:id", async (req, res) => {
  try {
    const item = await MissionVision.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE a mission/vision entry
router.put("/:id", async (req, res) => {
  try {
    const { title, description, borderColor, shadowColor } = req.body;

    const updatedItem = await MissionVision.findByIdAndUpdate(
      req.params.id,
      { title, description, borderColor, shadowColor },
      { new: true }
    );

    if (!updatedItem) return res.status(404).json({ message: "Item not found" });

    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a mission/vision entry
router.delete("/:id", async (req, res) => {
  try {
    const deletedItem = await MissionVision.findByIdAndDelete(req.params.id);
    if (!deletedItem) return res.status(404).json({ message: "Item not found" });
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

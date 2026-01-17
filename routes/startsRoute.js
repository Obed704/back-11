import express from "express";
import StatsSettings from "../models/Starts.js";

const router = express.Router();

// Get stats settings
router.get("/", async (req, res) => {
  const stats = await StatsSettings.findOne();
  res.json(stats);
});

// Update stats settings (numbers, colors, labels, bg)
router.put("/", async (req, res) => {
  const updated = await StatsSettings.findOneAndUpdate({}, req.body, {
    new: true,
    upsert: true,
  });
  res.json(updated);
});

export default router;

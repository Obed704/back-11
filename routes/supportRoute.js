// backend/routes/supportRoute.js
import express from "express";
import Support from "../models/support.js";

const router = express.Router();

// ✅ GET all support cards
router.get("/", async (req, res) => {
  console.log("📡 /api/support called");
  try {
    const supports = await Support.find();
    res.json(supports);
  } catch (err) {
    console.error("❌ Error fetching support data:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;

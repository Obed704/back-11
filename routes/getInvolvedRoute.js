import express from "express";
import GetInvolved from "../models/getInvolvedModel.js";

const router = express.Router();

// @desc Get all involvement items
// @route GET /api/getinvolved
router.get("/", async (req, res) => {
  try {
    const items = await GetInvolved.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching involvement data", error });
  }
});

export default router;

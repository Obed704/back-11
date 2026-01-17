import express from "express";
import SectionText from "../models/sisters.js";

const router = express.Router();

// GET
router.get("/:key", async (req, res) => {
  const section = await SectionText.findOne({ key: req.params.key });
  if (!section) return res.status(404).json({ error: "Not found" });
  res.json(section);
});

// UPDATE
router.put("/:key", async (req, res) => {
  const { title, paragraphs } = req.body;

  const updated = await SectionText.findOneAndUpdate(
    { key: req.params.key },
    { title, paragraphs },
    { new: true, upsert: true }
  );

  res.json(updated);
});

export default router;

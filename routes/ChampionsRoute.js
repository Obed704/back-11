import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Champion from "../models/Champion.js";

const router = express.Router();

// Resolve __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Configure Multer storage to backend/public/championsImage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/championsImage"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ✅ Get all champions
router.get("/", async (req, res) => {
  try {
    const champions = await Champion.find();
    res.json(champions);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get champion by ID
router.get("/:id", async (req, res) => {
  try {
    const champion = await Champion.findById(req.params.id);
    if (!champion) return res.status(404).json({ error: "Champion not found" });
    res.json(champion);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Create new champion with image upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, season, description, roadToVictory, alt, showHeader } = req.body;
    const image = req.file ? `/championsImage/${req.file.filename}` : null;

    const newChampion = new Champion({
      title,
      season,
      description,
      roadToVictory,
      alt,
      showHeader,
      image,
    });

    await newChampion.save();
    res.status(201).json(newChampion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create champion" });
  }
});

// ✅ Update champion (with optional new image)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, season, description, roadToVictory, alt, showHeader } = req.body;
    const updateData = {
      title,
      season,
      description,
      roadToVictory,
      alt,
      showHeader,
    };

    if (req.file) updateData.image = `/championsImage/${req.file.filename}`;

    const updatedChampion = await Champion.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedChampion);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update champion" });
  }
});

// ✅ Delete champion
router.delete("/:id", async (req, res) => {
  try {
    await Champion.findByIdAndDelete(req.params.id);
    res.json({ message: "Champion deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete champion" });
  }
});

export default router;

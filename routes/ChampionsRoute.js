import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import Champion from "../models/Champion.js";

const router = express.Router();

// Resolve __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= MULTER CONFIGURATION ================= //
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../public/championsImage"));
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed (jpeg, jpg, png, webp)"));
  }
};

const upload = multer({ storage, fileFilter });

// ================= HELPERS ================= //
// Extract year from season string, e.g. "Submerged – 2025" => 2025
const extractYear = (season) => {
  const match = season.match(/(\d{4})$/);
  return match ? parseInt(match[1]) : null;
};

// ================= ROUTES ================= //

// GET all champions, newest year first
router.get("/", async (req, res) => {
  try {
    const champions = await Champion.find().sort({ year: -1, createdAt: -1 });
    res.json(champions);
  } catch (err) {
    console.error("Error fetching champions:", err);
    res.status(500).json({ error: "Server error while fetching champions" });
  }
});

// GET champion by ID
router.get("/:id", async (req, res) => {
  try {
    const champion = await Champion.findById(req.params.id);
    if (!champion) return res.status(404).json({ error: "Champion not found" });
    res.json(champion);
  } catch (err) {
    console.error("Error fetching champion:", err);
    res.status(500).json({ error: "Server error while fetching champion" });
  }
});

// CREATE new champion
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, season, description, roadToVictory, alt, showHeader, year } = req.body;

    // Validation
    if (!title || !season || !description || !roadToVictory) {
      return res.status(400).json({ error: "All required fields must be provided" });
    }

    // Determine year
    let championYear = year ? parseInt(year) : extractYear(season);
    if (!championYear) championYear = new Date().getFullYear(); // fallback

    const image = req.file ? `/championsImage/${req.file.filename}` : null;

    const newChampion = new Champion({
      title,
      season,
      year: championYear,
      description,
      roadToVictory,
      alt: alt || title,
      showHeader: showHeader !== undefined ? showHeader : true,
      image,
    });

    await newChampion.save();
    res.status(201).json(newChampion);
  } catch (err) {
    console.error("Error creating champion:", err);
    res.status(500).json({ error: "Failed to create champion" });
  }
});

// UPDATE champion by ID
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, season, description, roadToVictory, alt, showHeader, year } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (season) updateData.season = season;
    if (description) updateData.description = description;
    if (roadToVictory) updateData.roadToVictory = roadToVictory;
    if (alt) updateData.alt = alt;
    if (showHeader !== undefined) updateData.showHeader = showHeader;
    if (req.file) updateData.image = `/championsImage/${req.file.filename}`;

    // Determine year for update
    if (year) {
      updateData.year = parseInt(year);
    } else if (season) {
      const extractedYear = extractYear(season);
      if (extractedYear) updateData.year = extractedYear;
    }

    const updatedChampion = await Champion.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedChampion) return res.status(404).json({ error: "Champion not found" });

    res.json(updatedChampion);
  } catch (err) {
    console.error("Error updating champion:", err);
    res.status(500).json({ error: "Failed to update champion" });
  }
});

// DELETE champion by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedChampion = await Champion.findByIdAndDelete(req.params.id);
    if (!deletedChampion) return res.status(404).json({ error: "Champion not found" });

    res.json({ message: "Champion deleted successfully" });
  } catch (err) {
    console.error("Error deleting champion:", err);
    res.status(500).json({ error: "Failed to delete champion" });
  }
});

export default router;

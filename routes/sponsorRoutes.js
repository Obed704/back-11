import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Sponsor from "../models/sponsors.js";

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(process.cwd(), "public/sponsors");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) return cb(null, true);
    cb(new Error("Only images (jpeg, jpg, png) are allowed"));
  },
});

// CREATE sponsor
router.post("/", upload.single("img"), async (req, res) => {
  try {
    const { name, description, gradient, btnColor } = req.body;
    const sponsor = new Sponsor({
      name,
      description,
      gradient,
      btnColor,
      img: req.file ? `/sponsors/${req.file.filename}` : "",
    });
    const savedSponsor = await sponsor.save();
    res.status(201).json(savedSponsor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE sponsor
router.put("/:id", upload.single("img"), async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.img = `/sponsors/${req.file.filename}`;
    const updatedSponsor = await Sponsor.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(updatedSponsor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE sponsor
router.delete("/:id", async (req, res) => {
  try {
    await Sponsor.findByIdAndDelete(req.params.id);
    res.json({ message: "Sponsor deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET all sponsors
router.get("/", async (req, res) => {
  try {
    const sponsors = await Sponsor.find();
    res.json(sponsors);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;

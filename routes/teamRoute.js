import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js"; // Import your shared config
import TeamMember from "../models/team.js";

const router = express.Router();

// 1. Configure Cloudinary Storage for Team Members
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "stem-inspires/team", // Cloudinary folder name
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 500, height: 500, crop: "fill", gravity: "face" }], // Auto-crop to faces
    public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
  }),
});

const upload = multer({ storage });

// GET all members (remains the same)
router.get("/", async (req, res) => {
  try {
    const team = await TeamMember.find({});
    res.json(team);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE member
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, role, email } = req.body;
    const member = new TeamMember({
      name,
      role,
      email: email || null,
      // Use the path provided by Cloudinary
      image: req.file ? req.file.path : "",
    });
    const saved = await member.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE member
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const updateData = { ...req.body };
    // Update the image only if a new file is provided
    if (req.file) updateData.image = req.file.path;

    const updated = await TeamMember.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "Member not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE member (remains the same)
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await TeamMember.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Member not found" });
    res.json({ message: "Member deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
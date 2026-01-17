import express from "express";
import multer from "multer";
import path from "path";
import EducationElement from "../models/education.js";

const router = express.Router();

// 📁 Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/education"); // Save to /public/education
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// ✅ GET all education elements
router.get("/", async (req, res) => {
  try {
    const elements = await EducationElement.find();
    res.json(elements);
  } catch (err) {
    console.error("Error fetching education elements:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ UPDATE an existing education element (title, description, etc.)
router.put("/:id", upload.single("img"), async (req, res) => {
  try {
    const { title, description, borderColor, alt } = req.body;
    const updateData = { title, description, borderColor, alt };

    // If an image was uploaded, add it to the update data
    if (req.file) {
      updateData.img = `/education/${req.file.filename}`;
    }

    const updated = await EducationElement.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updated)
      return res.status(404).json({ message: "Education element not found" });

    res.json(updated);
  } catch (err) {
    console.error("Error updating element:", err);
    res.status(500).json({ message: "Failed to update education element" });
  }
});

export default router;

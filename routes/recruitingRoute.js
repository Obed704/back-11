import express from "express";
import multer from "multer";
import path from "path";
import ProcessStep from "../models/recruiting.js";

const router = express.Router();

// 🔹 Configure Multer for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/recruiting"); // Save files into /public/recruiting
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({ storage });

// =============================
// GET all process steps
// =============================
router.get("/", async (req, res) => {
  try {
    const steps = await ProcessStep.find();
    res.json(steps);
  } catch (error) {
    console.error("Error fetching process steps:", error);
    res.status(500).json({ message: "Error fetching process steps" });
  }
});

// =============================
// UPDATE a process step
// =============================
router.put("/:id", upload.single("img"), async (req, res) => {
  try {
    const { title, description, alt, highlight } = req.body;

    const updateData = { title, description, alt, highlight };

    if (req.file) {
      updateData.img = `/recruiting/${req.file.filename}`;
    }

    const updatedStep = await ProcessStep.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedStep) {
      return res.status(404).json({ message: "Process step not found" });
    }

    res.json(updatedStep);
  } catch (error) {
    console.error("Error updating process step:", error);
    res.status(500).json({ message: "Error updating process step" });
  }
});

export default router;

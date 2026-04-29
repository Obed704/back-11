import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import School from "../models/School.js";

const router = express.Router();

// === CLOUDINARY CONFIG ===
// Make sure these variables are in your .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// === MULTER CLOUDINARY STORAGE ===
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ftc_schools", // The folder name in your Cloudinary dashboard
    allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
    public_id: (req, file) => `school-${Date.now()}`,
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// === CREATE SCHOOL ===
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, location, website } = req.body;

    if (!name || !location) {
      return res.status(400).json({ error: "Name and location are required" });
    }

    // req.file.path is the URL provided by Cloudinary
    const imgUrl = req.file ? req.file.path : "";

    const school = await School.create({
      name,
      location,
      website: website || "",
      img: imgUrl,
    });

    res.status(201).json(school);
  } catch (err) {
    console.error("Create error:", err);
    res.status(400).json({ error: err.message });
  }
});

// === GET ALL SCHOOLS ===
router.get("/", async (req, res) => {
  try {
    const schools = await School.find();
    res.json(schools);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// === UPDATE SCHOOL ===
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const update = { ...req.body };

    // If a new file is uploaded, update the image URL
    if (req.file) {
      update.img = req.file.path;
    }

    const updated = await School.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    if (!updated) return res.status(404).json({ error: "School not found" });
    res.json(updated);
  } catch (err) {
    console.error("Update error:", err);
    res.status(400).json({ error: err.message });
  }
});

// === DELETE SCHOOL ===
router.delete("/:id", async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) return res.status(404).json({ error: "School not found" });

    // Note: If you want to delete the image from Cloudinary too,
    // you would need to extract the public_id from the URL and use
    // cloudinary.uploader.destroy(public_id).

    await School.findByIdAndDelete(req.params.id);
    res.json({ message: "School deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
// backend/routes/galleryRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import GalleryImage from "../models/gallery.js";

const router = express.Router();

// Make sure this folder exists: backend/public/championsImage
const UPLOAD_FOLDER = "public/championsImage";

// Multer storage: save into public/championsImage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_FOLDER);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + file.originalname.replace(/\s+/g, "-");
    cb(null, unique);
  },
});
const upload = multer({ storage });

// Helper to delete a file (if exists)
const deleteFileIfExists = (relativePath) => {
  if (!relativePath) return;
  // relativePath expected like "/championsImage/abcdef.jpg"
  const filePath = path.join("public", relativePath.replace(/^\//, ""));
  if (fs.existsSync(filePath)) {
    try { fs.unlinkSync(filePath); } catch (e) { console.warn("Failed to delete:", filePath, e); }
  }
};

// GET all
router.get("/", async (req, res) => {
  try {
    const items = await GalleryImage.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Error fetching gallery", error: err.message });
  }
});

// POST new (upload)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image file required" });

    const imgPath = `/championsImage/${req.file.filename}`;
    const { alt, title } = req.body;

    const doc = new GalleryImage({ image: imgPath, alt: alt || "", title: title || "" });
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ message: "Error uploading image", error: err.message });
  }
});

// PUT update (replace image optionally and/or change alt/title)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const item = await GalleryImage.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    const { alt, title } = req.body;
    if (alt !== undefined) item.alt = alt;
    if (title !== undefined) item.title = title;

    if (req.file) {
      // delete old file
      deleteFileIfExists(item.image);
      // set new path
      item.image = `/championsImage/${req.file.filename}`;
    }

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: "Error updating image", error: err.message });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const item = await GalleryImage.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });

    // delete file
    deleteFileIfExists(item.image);
    await item.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting image", error: err.message });
  }
});

export default router;

// backend/routes/downloads.js
import express from "express";
import multer from "multer";
import path from "path";
import Download from "../models/download.js";

const router = express.Router();

// Multer storage: everything goes into public/resources
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/resources");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ==========================
// GET all downloads
// ==========================
router.get("/", async (req, res) => {
  try {
    const downloads = await Download.find();
    res.json(downloads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==========================
// CREATE download
// ==========================
router.post(
  "/",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title, description, fileType, fileSize, linkHref } = req.body;

      const filePath = req.files["file"]
        ? `/resources/${req.files["file"][0].filename}`
        : linkHref || "";

      const imagePath = req.files["image"]
        ? `/resources/${req.files["image"][0].filename}`
        : "";

      const download = new Download({
        title,
        description,
        fileType,
        fileSize,
        linkText: "Download",
        linkHref: filePath,
        image: imagePath,
        alt: fileType,
      });

      await download.save();
      res.status(201).json(download);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// ==========================
// UPDATE download
// ==========================
router.put(
  "/:id",
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const download = await Download.findById(req.params.id);
      if (!download) return res.status(404).json({ message: "Download not found" });

      const { title, description, fileType, fileSize, linkHref } = req.body;

      if (title) download.title = title;
      if (description) download.description = description;
      if (fileType) download.fileType = fileType;
      if (fileSize) download.fileSize = fileSize;

      // Update file if uploaded, otherwise keep or use external link
      if (req.files["file"]) {
        download.linkHref = `/resources/${req.files["file"][0].filename}`;
      } else if (linkHref) {
        download.linkHref = linkHref;
      }

      // Update image if uploaded
      if (req.files["image"]) {
        download.image = `/resources/${req.files["image"][0].filename}`;
      }

      await download.save();
      res.json(download);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// ==========================
// DELETE download
// ==========================
router.delete("/:id", async (req, res) => {
  try {
    await Download.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

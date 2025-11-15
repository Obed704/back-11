import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import School from "../models/School.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// === ENSURE UPLOAD DIRECTORY EXISTS ===
const uploadDir = path.join(__dirname, "../public/ftc");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Created upload directory:", uploadDir);
}

// === MULTER CONFIG ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save to backend/public/ftc
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, "img-" + uniqueSuffix + ext); // e.g. img-1234567890.jpg
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extOk = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowedTypes.test(file.mimetype);
    if (extOk && mimeOk) return cb(null, true);
    cb(new Error("Only image files (jpeg, jpg, png, gif, webp) are allowed"));
  },
});

// === CREATE SCHOOL ===
// CREATE SCHOOL
router.post("/", (req, res) => {
  upload.single("img")(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err.message);
      return res.status(400).json({ error: err.message });
    }

    try {
      const { name, location, website } = req.body;

      if (!name || !location) {
        return res.status(400).json({ error: "Name and location are required" });
      }

      const imgUrl = req.file ? `/ftc/${req.file.filename}` : "";

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
});


// === GET ALL SCHOOLS ===
router.get("/", async (req, res) => {
  try {
    const schools = await School.find();
    res.json(schools);
  } catch (err) {
    console.error("Get all error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// === GET ONE SCHOOL ===
router.get("/:id", async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) return res.status(404).json({ error: "School not found" });
    res.json(school);
  } catch (err) {
    res.status(404).json({ error: "School not found" });
  }
});

// === UPDATE SCHOOL ===
router.put("/:id", upload.single("img"), async (req, res) => {
  try {
    const update = { ...req.body };
    if (req.file) update.img = `/ftc/${req.file.filename}`;

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

    // Optional: Delete image from disk
    if (school.img) {
      const filePath = path.join(__dirname, "../public", school.img);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Failed to delete image:", err);
      });
    }

    await School.findByIdAndDelete(req.params.id);
    res.json({ message: "School deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(400).json({ error: err.message });
  }
});

export default router;
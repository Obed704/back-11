import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import FtcLanding from "../models/ftcLanding.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === UPLOAD DIR ===
const uploadDir = path.join(__dirname, "../public/ftc");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// === MULTER ===
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `ftc-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

// === GET FTC CONTENT (PUBLIC) ===
router.get("/", async (req, res) => {
  const data = await FtcLanding.findOne();
  res.json(data);
});

// === UPDATE FTC CONTENT (ADMIN) ===
router.put(
  "/",
  upload.fields([
    { name: "heroImage", maxCount: 1 },
    { name: "aboutImage", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const body = JSON.parse(req.body.data);

      if (req.files?.heroImage)
        body.hero.backgroundImage = `/ftc/${req.files.heroImage[0].filename}`;

      if (req.files?.aboutImage)
        body.about.image = `/ftc/${req.files.aboutImage[0].filename}`;

      const updated = await FtcLanding.findOneAndUpdate(
        {},
        body,
        { new: true, upsert: true }
      );

      res.json(updated);
    } catch (err) {
      console.error("FTC Update error:", err);
      res.status(400).json({ error: err.message });
    }
  }
);

export default router;

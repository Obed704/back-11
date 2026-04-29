import express from "express";
import Champion from "../models/Champion.js";
import { upload } from "../config/cloudinary.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// ─── Helpers ──────────────────────────────────────────────────────────────────

const extractYear = (season) => {
  const match = season?.match(/(\d{4})/);
  return match ? parseInt(match[1]) : new Date().getFullYear();
};

const deleteCloudinaryImage = async (imageUrl) => {
  if (!imageUrl) return;
  try {
    const parts = imageUrl.split("/");
    const publicId = parts.slice(-2).join("/").replace(/\.[^/.]+$/, "");
    await cloudinary.uploader.destroy(publicId);
    console.log("🗑️  Cloudinary image removed:", publicId);
  } catch (err) {
    console.warn("⚠️  Could not remove Cloudinary image:", err.message);
  }
};

const handleUploadError = (err, res) => {
  console.error("❌ Upload Error:", err);
  if (err.http_code === 403 || err?.message?.includes("403")) {
    return res.status(403).json({
      error: "Cloudinary Upload Forbidden (403)",
      details: "API credentials invalid, or upload preset is set to Unsigned.",
      fix: "Cloudinary Dashboard → Settings → Upload Presets → change Mode to Signed. Also verify CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET in .env",
    });
  }
  if (err.http_code === 401) {
    return res.status(401).json({
      error: "Cloudinary Unauthorized (401)",
      details: "API key or secret is missing.",
      fix: "Check CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env",
    });
  }
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File Too Large", details: "Image must be under 10 MB." });
  }
  if (err.message === "Only image files are allowed") {
    return res.status(400).json({ error: "Invalid File Type", details: "Only JPG, PNG, WebP accepted." });
  }
  return res.status(500).json({
    error: "Upload Failed",
    details: err.message || "Unknown upload error",
    http_code: err.http_code || null,
  });
};

// ─── GET /api/champions ───────────────────────────────────────────────────────
// Query: ?year=2024  ?search=robotics  ?page=1&limit=20
router.get("/", async (req, res) => {
  try {
    const { year, search, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (year) filter.year = parseInt(year);
    if (search) filter.title = { $regex: search, $options: "i" };

    const total = await Champion.countDocuments(filter);
    const champions = await Champion.find(filter)
      .sort({ year: -1, rank: -1, createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({
      champions,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
    });
  } catch (err) {
    console.error("❌ Fetch Error:", err);
    res.status(500).json({ error: "Failed to fetch champions", details: err.message });
  }
});

// ─── GET /api/champions/years ─────────────────────────────────────────────────
// Distinct year list, sorted desc — useful for frontend filter dropdowns
router.get("/years", async (req, res) => {
  try {
    const years = await Champion.distinct("year");
    res.json(years.sort((a, b) => b - a));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch years", details: err.message });
  }
});

// ─── GET /api/champions/:id ───────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const champion = await Champion.findById(req.params.id);
    if (!champion) return res.status(404).json({ error: "Champion not found" });
    res.json(champion);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch champion", details: err.message });
  }
});

// ─── POST /api/champions ──────────────────────────────────────────────────────
router.post("/", (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) return handleUploadError(err, res);
    try {
      const { title, season, description, roadToVictory, alt, showHeader, rank } = req.body;
      if (!title?.trim() || !season?.trim()) {
        return res.status(400).json({ error: "Validation Error", details: "Title and Season are required." });
      }
      const champion = new Champion({
        title: title.trim(),
        season: season.trim(),
        year: extractYear(season),
        description: description?.trim() || "",
        roadToVictory: roadToVictory?.trim() || "",
        alt: alt?.trim() || title.trim(),
        showHeader: showHeader === "true" || showHeader === true,
        rank: parseInt(rank) || 0,
        image: req.file?.path || null,
      });
      const saved = await champion.save();
      console.log("✅ Champion created:", saved._id);
      res.status(201).json(saved);
    } catch (dbErr) {
      console.error("❌ DB Error:", dbErr);
      if (dbErr.name === "ValidationError") {
        return res.status(400).json({
          error: "Validation Error",
          details: Object.values(dbErr.errors).map((e) => e.message).join(", "),
        });
      }
      res.status(500).json({ error: "Database Error", details: dbErr.message });
    }
  });
});

// ─── PUT /api/champions/:id ───────────────────────────────────────────────────
// Send removeImage=true to clear existing image without uploading a new one.
router.put("/:id", (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) return handleUploadError(err, res);
    try {
      const champion = await Champion.findById(req.params.id);
      if (!champion) return res.status(404).json({ error: "Champion not found" });

      const { title, season, description, roadToVictory, alt, showHeader, rank, removeImage } = req.body;

      let imageUrl = champion.image;
      if (req.file) {
        await deleteCloudinaryImage(champion.image);
        imageUrl = req.file.path;
      } else if (removeImage === "true") {
        await deleteCloudinaryImage(champion.image);
        imageUrl = null;
      }

      const updatedSeason = season?.trim() || champion.season;

      const updated = await Champion.findByIdAndUpdate(
        req.params.id,
        {
          title: title?.trim() || champion.title,
          season: updatedSeason,
          year: extractYear(updatedSeason),
          description: description !== undefined ? description.trim() : champion.description,
          roadToVictory: roadToVictory !== undefined ? roadToVictory.trim() : champion.roadToVictory,
          alt: alt?.trim() || champion.alt,
          showHeader: showHeader !== undefined
            ? showHeader === "true" || showHeader === true
            : champion.showHeader,
          rank: rank !== undefined ? parseInt(rank) : champion.rank,
          image: imageUrl,
        },
        { new: true, runValidators: true }
      );

      console.log("✏️  Champion updated:", updated._id);
      res.json(updated);
    } catch (dbErr) {
      console.error("❌ Update Error:", dbErr);
      if (dbErr.name === "ValidationError") {
        return res.status(400).json({
          error: "Validation Error",
          details: Object.values(dbErr.errors).map((e) => e.message).join(", "),
        });
      }
      res.status(500).json({ error: "Update Failed", details: dbErr.message });
    }
  });
});

// ─── PATCH /api/champions/:id/toggle-header ───────────────────────────────────
router.patch("/:id/toggle-header", async (req, res) => {
  try {
    const champion = await Champion.findById(req.params.id);
    if (!champion) return res.status(404).json({ error: "Champion not found" });
    champion.showHeader = !champion.showHeader;
    await champion.save();
    res.json({ _id: champion._id, showHeader: champion.showHeader });
  } catch (err) {
    res.status(500).json({ error: "Toggle failed", details: err.message });
  }
});

// ─── DELETE /api/champions/:id ────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const champion = await Champion.findById(req.params.id);
    if (!champion) return res.status(404).json({ error: "Champion not found" });
    await deleteCloudinaryImage(champion.image);
    await Champion.findByIdAndDelete(req.params.id);
    console.log("🗑️  Champion deleted:", req.params.id);
    res.json({ success: true, message: "Champion deleted successfully" });
  } catch (err) {
    console.error("❌ Delete Error:", err);
    res.status(500).json({ error: "Delete failed", details: err.message });
  }
});

// ─── DELETE /api/champions (bulk) ─────────────────────────────────────────────
router.delete("/bulk", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Provide an array of ids to delete" });
    }
    const champions = await Champion.find({ _id: { $in: ids } });
    await Promise.all(champions.map((c) => deleteCloudinaryImage(c.image)));
    await Champion.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, deleted: ids.length });
  } catch (err) {
    res.status(500).json({ error: "Bulk delete failed", details: err.message });
  }
});

// ─── GET /api/champions/debug-cloudinary ──────────────────────────────────────
router.get("/debug-cloudinary", async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(
      "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      { folder: "champions/debug" }
    );
    await cloudinary.uploader.destroy(result.public_id).catch(() => { });
    res.json({ success: true, message: "Cloudinary working correctly", url: result.secure_url });
  } catch (err) {
    res.status(err.http_code || 500).json({
      error: "Cloudinary Test Failed",
      message: err.message,
      http_code: err.http_code || null,
      hint: err.http_code === 403 ? "Invalid credentials or unsigned preset." : "Check server logs.",
    });
  }
});

export default router;
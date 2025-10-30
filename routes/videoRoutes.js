import express from "express";
import Video from "../models/video.js";

const router = express.Router();

// Helper to convert YouTube URLs to embed format
function convertToEmbedUrl(url) {
  if (!url) return "";
  
  // Already an embed URL
  if (url.includes("youtube.com/embed")) return url;

  // Playlist URL (already works)
  if (url.includes("list=")) {
    const playlistIdMatch = url.match(/list=([a-zA-Z0-9_-]+)/);
    if (playlistIdMatch) return `https://www.youtube.com/embed/videoseries?list=${playlistIdMatch[1]}`;
  }

  // Short youtu.be link
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) return `https://www.youtube.com/embed/${shortMatch[1]}`;

  // Standard watch URL
  const watchMatch = url.match(/v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) return `https://www.youtube.com/embed/${watchMatch[1]}`;

  return url; // fallback
}

// GET all videos
router.get("/", async (req, res) => {
  try {
    const videos = await Video.find();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new video
router.post("/", async (req, res) => {
  try {
    const { title, description, embedUrl } = req.body;
    const video = new Video({
      title,
      description,
      embedUrl: convertToEmbedUrl(embedUrl)
    });

    const savedVideo = await video.save();
    res.status(201).json(savedVideo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE video
router.put("/:id", async (req, res) => {
  try {
    const { title, description, embedUrl } = req.body;
    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        embedUrl: convertToEmbedUrl(embedUrl)
      },
      { new: true }
    );
    res.json(updatedVideo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE video
router.delete("/:id", async (req, res) => {
  try {
    await Video.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;

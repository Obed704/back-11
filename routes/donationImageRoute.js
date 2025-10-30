// routes/adminDonationRoute.js
import express from "express";
import multer from "multer";
import path from "path";
import DonationImage from "../models/donationImageModel.js";

const router = express.Router();

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("public/donateImages"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ CREATE (Upload new image)
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { side } = req.body;
    const imagePath = `/donateImages/${req.file.filename}`;
    const newImage = await DonationImage.create({ side, image: imagePath });
    res.status(201).json(newImage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading image" });
  }
});

// ✅ READ (All images)
router.get("/", async (req, res) => {
  try {
    const images = await DonationImage.find();
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: "Error fetching images" });
  }
});

// ✅ UPDATE (Change image or side)
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { side } = req.body;
    const updateData = { side };

    if (req.file) updateData.image = `/donateImages/${req.file.filename}`;

    const updated = await DonationImage.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating image" });
  }
});

// ✅ DELETE
router.delete("/:id", async (req, res) => {
  try {
    await DonationImage.findByIdAndDelete(req.params.id);
    res.json({ message: "Image deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting image" });
  }
});

export default router;

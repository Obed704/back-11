import express from "express";
import GetInvolved from "../models/getInvolvedModel.js";
import upload from "../multer/uploadGetInvolved.js";

const router = express.Router();

// Get all items
router.get("/", async (req, res) => {
  try {
    const items = await GetInvolved.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new item
router.post("/", upload.single("img"), async (req, res) => {
  try {
    const newItem = new GetInvolved({
      ...req.body,
      img: req.file ? `/getInvolved/${req.file.filename}` : req.body.img,
    });
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update item
router.put("/:id", upload.single("img"), async (req, res) => {
  try {
    const updatedItem = await GetInvolved.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        ...(req.file && { img: `/getInvolved/${req.file.filename}` }),
      },
      { new: true }
    );
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete item
router.delete("/:id", async (req, res) => {
  try {
    await GetInvolved.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

import express from "express";
import Contact from "../models/email.js";

const router = express.Router();

// Get all contacts
router.get("/", async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get contacts by subject
router.get("/subject/:subject", async (req, res) => {
  try {
    const contacts = await Contact.find({ subject: req.params.subject }).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark as read
router.patch("/read/:id", async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { status: "read" }, { new: true });
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete contact
router.delete("/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, customSubject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Name, email, and message are required" });
    }

    const contact = new Contact({
      name,
      email,
      subject,
      customSubject,
      message,
    });

    await contact.save();

    res.status(201).json({ message: "Contact submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;

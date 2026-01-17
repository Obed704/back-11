import express from "express";
import client from "../config/openai.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("Incoming message:", req.body.message); // log message

    if (!req.body.message) {
      return res.status(400).json({ error: "No message provided" });
    }

    const response = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: req.body.message }],
    });

    console.log("OpenAI response:", response);
    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error("Error in /api/chat:", err); // detailed error
    res.status(500).json({ error: err.message });
  }
});

export default router;

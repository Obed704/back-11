import client from "../config/openai.js";
import { findBestIntentAdvanced } from "../utils/intents.js";

export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    // 1. Try intent matching
    const matchedIntent = findBestIntentAdvanced(message);
    if (matchedIntent) {
      return res.json({
        reply:
          matchedIntent.responses[
            Math.floor(Math.random() * matchedIntent.responses.length)
          ],
      });
    }

    // 2. Otherwise, fallback to GPT
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    res.json({ reply: completion.choices[0].message.content });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Failed to process chat" });
  }
};

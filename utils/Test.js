import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testModels() {
  try {
    const response = await fetch("https://generativelanguage.googleapis.com/v1/models", {
      headers: { "Authorization": `Bearer ${process.env.GEMINI_API_KEY}` }
    });

    const data = await response.json();
    console.log("Available models:", data);
  } catch (err) {
    console.error("Error fetching models:", err);
  }
}

testModels();

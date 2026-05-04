import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function probe() {
    // We try without the "models/" prefix first, as the SDK adds it automatically
    const targets = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash"];

    console.log("📡 Probing models...");

    for (const name of targets) {
        try {
            const model = genAI.getGenerativeModel({ model: name });
            const result = await model.generateContent("hi");
            console.log(`✅ SUCCESS: ${name} is active.`);
            return;
        } catch (err) {
            console.log(`❌ ${name} failed: ${err.message.split('\n')[0]}`);
        }
    }
}

probe();
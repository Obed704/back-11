import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import GetInvolved from "../models/getInvolvedModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI not found");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB connected");

    await GetInvolved.deleteMany();

    const seedData = [
      {
        title: "Take FLL to Your School",
        description: "Interested in the FIRST LEGO League program but need help to participate? Contact us and a mentor will get in touch with you.",
        img: "/getInvolved/first-lego-league-get-involved.jpg",
        buttonText: "Start a Team",
        buttonLink: "/contact?subject=Take%20FLL%20to%20Your%20School",
        buttonColor: "#f21ea7",
      },
      {
        title: "Grow the Vision",
        description: "Enable a new generation of aspiring engineers to start building. Support students by sponsoring a robotics team. Your contribution helps with kits, mentorship, and competition access.",
        img: "/getInvolved/girls-in-stem.jpg",
        buttonText: "Become a Sponsor",
        buttonLink: "/contact?subject=Become%20a%20Sponsor",
        buttonColor: "#f7f42e",
      },
    ];

    await GetInvolved.insertMany(seedData);
    console.log("✅ GetInvolved seeded");
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

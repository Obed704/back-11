import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import FtcLanding from "../models/ftcLanding.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

await mongoose.connect(process.env.MONGO_URI);

await FtcLanding.deleteMany();

await FtcLanding.create({
  hero: {
    titlePrefix: "Introducing",
    titleHighlight: "FIRST Tech Challenge",
    subtitle:
      "Inspiring the next generation of innovators through robotics, teamwork, and real-world problem solving.",
    backgroundImage: "/ftc/first-tech-challenge.jpg",
    ctaText: "Join the Challenge",
    ctaLink: "/contact?subject=Joining%20FTC%20Challenge",
  },

  about: {
    title: "About the Competition",
    description:
      "FIRST® Tech Challenge students work together with their mentors to design and build robots...",
    image: "/ftc/ftc-1.jpg",
    linkText: "Learn More",
    linkUrl: "https://www.firstinspires.org/",
  },

  schoolsSection: {
    title: "Schools Connected",
    ctaText: "Take It To Your School",
    ctaLink: "/contact?subject=Taking%20FTC%20To%20Your%20School",
  },
});

console.log("✅ FTC Landing Seeded");
process.exit();

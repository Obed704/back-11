import mongoose from "mongoose";
import dotenv from "dotenv";
import ProjectSlide from "../models/carouserSlider.js";

dotenv.config();

const slides = [
  { src: "/our-project-SLIDE/1.jpg", alt: "Students in Robotics Class", caption: "Excited students learning robotics" },
  { src: "/our-project-SLIDE/2.jpg", alt: "Robotics Competition", caption: "Participating in a robotics competition" },
  { src: "/our-project-SLIDE/3.jpg", alt: "Building Robots", caption: "Team collaborating on a robot" },
  { src: "/our-project-SLIDE/4.JPG", alt: "Presentation", caption: "Presenting their project" },
  { src: "/our-project-SLIDE/5.jpg", alt: "Students in Robotics Class", caption: "Excited students learning robotics" },
  { src: "/our-project-SLIDE/6.jpg", alt: "Robotics Competition", caption: "Participating in a robotics competition" },
  { src: "/our-project-SLIDE/7.JPG", alt: "Building Robots", caption: "Team collaborating on a robot" },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await ProjectSlide.deleteMany();
    await ProjectSlide.insertMany(slides);
    console.log("✅ Project slides seeded!");
    mongoose.connection.close();
  })
  .catch((err) => console.error("❌ Seeder error:", err));

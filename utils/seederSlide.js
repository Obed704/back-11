// backend/seeder.js
import mongoose from "mongoose";
import Slide from "../models/slide.js";



const slidesData = [
  { bg: "/welcomeSlide/emilia-president-img.jpg" },
  { bg: "/welcomeSlide/table.jpg" },
  { bg: "/welcomeSlide/hall-2.JPG" },
  { bg: "/welcomeSlide/hall.JPG" },
  { bg: "/welcomeSlide/cups.jpg" },
  { bg: "/welcomeSlide/slide-show-axel.jsx.jpg" },
  { bg: "/welcomeSlide/axel.jpg" },
];

mongoose
  .connect("mongodb+srv://niyobyoseobed1:obedobed@practicedb.tyllbhf.mongodb.net/PracticeDB?retryWrites=true&w=majority&appName=PracticeDB")
  .then(async () => {
    await Slide.deleteMany(); // Clear existing
    await Slide.insertMany(slidesData);
    console.log("✅ Slides seeded successfully!");
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

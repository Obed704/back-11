import mongoose from "mongoose";
import dotenv from "dotenv";
import Sponsor from "../models/sponsors.js";

dotenv.config();

const sponsorsData = [
  {
    id: 1,
    name: "Creativity Lab",
    description: "Leading Creativity Solutions",
    img: "/sponsors/sponsor-creativity-lab.avif",
    gradient: "from-blue-900 to-blue-700",
    btnColor: "text-blue-500 hover:bg-blue-100",
  },
  {
    id: 2,
    name: "Codelina",
    description: "Codelina Technologies",
    img: "/sponsors/codelina11.png",
    gradient: "from-yellow-900 to-yellow-700",
    btnColor: "text-yellow-500 hover:bg-yellow-100",
  },
  {
    id: 3,
    name: "Stella",
    description: "Stella Innovative AI Systems",
    img: "/sponsors/sponsor-stella.avif",
    gradient: "from-pink-900 to-pink-700",
    btnColor: "text-pink-500 hover:bg-pink-100",
  },
  {
    id: 4,
    name: "Teach Rwanda",
    description: "Teach Rwanda --",
    img: "/sponsors/sponsor-teach-rwanda.avif",
    gradient: "from-blue-900 to-pink-700",
    btnColor: "text-purple-500 hover:bg-purple-100",
  },
  {
    id: 5,
    name: "UNESCO",
    description: "Powering Education Systems",
    img: "/sponsors/sponsor-unesco.avif",
    gradient: "from-pink-900 to-pink-700",
    btnColor: "text-pink-500 hover:bg-pink-100",
  },
  {
    id: 6,
    name: "Wolfpack Machina",
    description: "wolfpackmachina.com",
    img: "/sponsors/sponsor.avif",
    gradient: "from-pink-900 to-pink-700",
    btnColor: "text-pink-500 hover:bg-pink-100",
  },
  {
    id: 7,
    name: "seme city",
    description: "A committed community",
    img: "/sponsors/seme city logo_JPG.avif",
    gradient: "from-green-900 to-green-700",
    btnColor: "text-green-500 hover:bg-green-100",
  },
  {
    id: 8,
    name: "Rwanda Education Board",
    description: "Powering Education Systems",
    img: "/sponsors/REB Logo_jfif.avif",
    gradient: "from-pink-900 to-pink-700",
    btnColor: "text-pink-500 hover:bg-pink-100",
  },
  {
    id: 9,
    name: "tonny robbins foundation",
    description: "tonny robins",
    img: "/sponsors/tony robbins foundation_JPG.avif",
    gradient: "from-indigo-900 to-indigo-700",
    btnColor: "text-indigo-500 hover:bg-indigo-100",
  },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB connected...");
    await Sponsor.deleteMany(); // clear existing
    await Sponsor.insertMany(sponsorsData);
    console.log("Sponsors data seeded!");
    process.exit();
  })
  .catch((err) => console.error(err));

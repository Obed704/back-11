import mongoose from "mongoose";
import dotenv from "dotenv";
import FLL from "../models/Fll.js";

dotenv.config({ path: "../.env" });

const MONGO_URI = process.env.MONGO_URI;

const seedData = [
  {
    title: "FIRST LEGO League",
    description:
      "FIRST LEGO League introduces STEM to children ages 9–16 through hands-on learning. Participants gain real-world problem-solving experiences.",
    logo: "/getInvolved/fll-logo.jpeg",
    mapUrl: "https://www.google.com/maps/d/embed?mid=1YEB-ekeeOGA44BvLrk5FFcMhKfc531U&ehbc=2E312F",
  },
];

const seedDB = async () => {
  try {
    if (!MONGO_URI) throw new Error("MONGO_URI not found in .env");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    await FLL.deleteMany({});
    console.log("Old FLL data deleted");

    await FLL.insertMany(seedData);
    console.log("Seeder data inserted");

    process.exit();
  } catch (err) {
    console.error("Error seeding FLL:", err);
    process.exit(1);
  }
};

seedDB();

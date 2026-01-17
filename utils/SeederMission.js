import mongoose from "mongoose";
import dotenv from "dotenv";
import MissionVision from "../models/VisionMission.js";

dotenv.config();

const data = [
  {
    title: "Our Mission",
    description:
      "We are bringing FIRST LEGO League (FLL) robotics to children ages 9 to 16 to teach the basics of robot design, programming, and problem solving all through a competitive and engaging hands-on learning experience.",
    borderColor: "border-blue-600",
    shadowColor: "hover:shadow-blue-400/50",
  },
  {
    title: "Our Vision",
    description:
      "To create a world where young people dream big, develop confidence in STEM, and use robotics to innovate, solve real-world problems, and shape a better future.",
    borderColor: "border-green-500",
    shadowColor: "hover:shadow-pink-400/50",
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://niyobyoseobed1:obedobed@practicedb.tyllbhf.mongodb.net/PracticeDB?retryWrites=true&w=majority&appName=PracticeDB");
    await MissionVision.deleteMany();
    await MissionVision.insertMany(data);
    console.log("✅ Seeder data inserted!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();

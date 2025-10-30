import mongoose from "mongoose";
import connectDB from "../config/connectMongo.js";
import GetInvolved from "../models/getInvolvedModel.js";

const involvementData = [
  {
    title: "Take FLL to Your School",
    description:
      "Interested in the FIRST LEGO League program but need help to participate? Contact us and a mentor will get in touch with you.",
    img: "/getInvolved/first-lego-league-get-involved.jpg",
    buttonText: "Start a Team",
    buttonLink: "/contact?subject=Take%20FLL%20to%20Your%20School",
    buttonColor: "bg-pink-400 hover:bg-blue-800",
  },
  {
    title: "Grow the Vision",
    description:
      "Enable a new generation of aspiring engineers to start building. Support students by sponsoring a robotics team. Your contribution helps with kits, mentorship, and competition access.",
    img: "/getInvolved/girls-in-stem.jpg",
    buttonText: "Become a Sponsor",
    buttonLink: "/contact?subject=Become%20a%20Sponsor",
    buttonColor: "bg-yellow-500 hover:bg-blue-800",
  },
];


const seedData = async () => {
  try {
    await connectDB();
    await GetInvolved.deleteMany();
    await GetInvolved.insertMany(involvementData);
    console.log("✅ GetInvolved data seeded!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedData();

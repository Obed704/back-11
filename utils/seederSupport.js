import mongoose from "mongoose";
import Support from "../models/support.js";
import connectDB from "../config/connectMongo.js";

const supports = [
  {
    title: "Donate to STEM",
    description: "Support our programs and help students access STEM education.",
    linkText: "Donate Now",
    linkHref: "/contact?subject=Donate%20to%20STEM",
    image: "/support/donate.jpg",
    alt: "Donate",
  },
  {
    title: "Become a Mentor",
    description: "Guide students in robotics, coding, and engineering challenges.",
    linkText: "Sign Up",
    linkHref: "/contact?subject=Become%20a%20Mentor",
    image: "/support/mentor.jpg",
    alt: "Mentor",
  },
  {
    title: "Sponsor a Team",
    description: "Enable teams to access kits, mentorship, and competitions.",
    linkText: "Sponsor",
    linkHref: "/contact?subject=Sponsor%20a%20Team",
    image: "/support/sponsor.jpg",
    alt: "Sponsor",
  },
];

const seedSupports = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Clear existing data
    await Support.deleteMany();

    // Insert new data
    await Support.insertMany(supports);

    console.log("✅ Support cards seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

// Run the function
seedSupports();

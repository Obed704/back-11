import mongoose from "mongoose";
import Support from "../models/support.js";
import connectDB from "../config/connectMongo.js";

const supports = [
  {
    title: "Sharing Skills",
    description: "Do you have cool ideas for this year's LEGO League theme?",
    linkText: "Share them with our teams!",
    linkHref: "#",
    image: "/support/sharing-skills.avif",
    alt: "Person sharing skills with students",
  },
  {
    title: "Sending Used Pieces",
    description: "Have retired LEGO devices or tools? Contact us via the",
    linkText: "form",
    linkHref: "#",
    image: "/support/pieces.avif",
    alt: "Used LEGO pieces",
  },
  {
    title: "Helping Hand",
    description: "Live in Rwanda? Join us on site and help build with the team.",
    linkText: "Let us know!",
    linkHref: "#",
    image: "/support/helping-hand.avif",
    alt: "Helping hand on building site",
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

import mongoose from "mongoose";
import connectDB from "../config/connectMongo.js";
import DonationImage from "../models/donationImageModel.js";


const images = [
  // Left-side images
  { side: "left", image: "/donateImages/a.JPG" },
  { side: "left", image: "/donateImages/b.JPG" },
  { side: "left", image: "/donateImages/c.JPG" },
  { side: "left", image: "/donateImages/d.JPG" },

  // Right-side images
  { side: "right", image: "/donateImages/d1.avif" },
  { side: "right", image: "/donateImages/d2.avif" },
  { side: "right", image: "/donateImages/d3.avif" },
  { side: "right", image: "/donateImages/d4.avif" },
];

const seedImages = async () => {
  try {
    await connectDB();
    await DonationImage.deleteMany();
    await DonationImage.insertMany(images);
    console.log("✅✅✅✅✅✅ Donation images seeded!");
    process.exit();
  } catch (err) {
    console.error("❌ Error seeding donation images:", err);
    process.exit(1);
  }
};

seedImages();

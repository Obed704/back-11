import mongoose from "mongoose";
import dotenv from "dotenv";
import EducationElement from "../models/education.js";

dotenv.config();

const data = [
  {
    title: "Build Excitement",
    description:
      "By visiting schools to showcase the FLL program we generate a vision for what's possible. We talk to heads of school, teachers, and students to make sure they are all ready to commit 100%.",
    img: "/education/BUILDING-EXICITEMENTS.jpg",
    alt: "Excited Children",
    borderColor: "border-blue-100",
  },
  {
    title: "Build the Resource Base",
    description:
      "We donate starter kits, expansion sets, and competition mats to schools that are interested in the competition but can't afford it on their own.",
    img: "/education/resource-base.avif",
    alt: "Resources",
    borderColor: "border-gray-100",
  },
  {
    title: "Build Engineers",
    description:
      "Continuous support helps teams reach their full potential. We host mentoring sessions, share online resources, and meet with the team on a weekly basis.",
    img: "/education/building-engineers.jpg",
    alt: "Engineers",
    borderColor: "border-gray-100",
  },
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await EducationElement.deleteMany();
    await EducationElement.insertMany(data);
    console.log("✅ Education elements seeded!");
    mongoose.connection.close();
  })
  .catch((err) => console.log("❌ Seeder error:", err));

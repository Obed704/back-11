// seeder.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import ProcessStep from "../models/recruiting.js";

dotenv.config();

const processSteps = [
  {
    title: "Discovering Interest",
    description:
      "Sharing what FIRST LEGO League is about with schools, students and governments is the first step. When we tell people about our project, parents say their kids have been waiting for an opportunity like this at their school.\n\nWhy are they waiting?",
    img: "/recruiting/discovering-interest.jpg",
    alt: "Classroom",
    highlight: "text-indigo-600",
  },
  {
    title: "Addressing Roadblocks",
    description:
      "Whether they're located tens of miles from the city, don't have internet, or lack the resources to start a team, STEM Inspires fixes the problem. We also host capacity-building workshops for coaches to enhance their abilities to support the teams they manage.",
    img: "/recruiting/addressing-road-brokes.avif",
    alt: "School Building",
  },
  {
    title: "Getting it Started",
    description:
      "STEM Inspires meets with students and presents to them the FIRST LEGO League. Highlights of the presentation include the learning and community experiences every member is sure to have if they join. You don't have to say much to gather excitement",
    img: "/recruiting/getting-started.avif",
    alt: "Presentation",
  },
  {
    title: "Continuous Support",
    description:
      "Learning how to build robots isn't easy. With direct communication with the team leaders, STEM Inspires supports the development, building, education, and management of the FIRST LEGO League teams for their first months of learning.",
    img: "/recruiting/continous-support.jpg",
    alt: "Support",
  },
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    await ProcessStep.deleteMany();
    await ProcessStep.insertMany(processSteps);
    console.log("✅ Process steps seeded!");
    process.exit();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

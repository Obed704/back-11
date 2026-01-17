import mongoose from "mongoose";
import ConnectDB from "../config/connectMongo.js"
import Download from "../models/download.js";
import Video from "../models/video.js";



const downloadsData = [
  {
    id: 1,
    title: "Team Timeline",
    description:
      "Here is a week-by-week schedule to keep your team on track for developing your robot and project for the upcoming competition!",
    linkText: "Download pdf",
    linkHref:
      "https://www.steminspires.tech/_files/ugd/a25e75_440939e5f90d44dc8872b6974a8e61bd.pdf",
    fileType: "📄 PDF",
    fileSize: "1.2 MB",
    image: "resources/team-timeline-pic.avif",
    alt: "PDF",
  },
  {
    id: 3,
    title: "Programming App",
    description:
      'Click here to download the SPIKE Programming application or launch it on your web browser. Then click on the arrow next to "LAUNCH WEB APP" and click "Download - 2.0.8".',
    linkText: "Download",
    linkHref: "https://education.lego.com/en-us/downloads/spike-app/software",
    fileType: "📄 PDF",
    fileSize: "1.3 GB",
    image: "resources/spike.jpg",
    alt: "PDF",
  },
  {
    id: 4,
    title: "Basic Curriculum",
    description:
      "Here is the basic FLL curriculum to teach students how to build and program the robots: Competition Ready | SPIKE Prime Unit Plan | LEGO® Education.",
    linkText: "Take a look",
    linkHref:
      "https://education.lego.com/en-us/lessons/prime-competition-ready",
    fileType: "",
    fileSize: "",
    image: "resources/basic-curriculum-pic.avif",
    alt: "PDF",
  },
];

const videosData = [
  {
    id: 1,
    title: "Robot Design",
    description: "Learn about robot design concepts and techniques.",
    embedUrl:
      "https://www.youtube.com/embed/videoseries?list=PL26PXKDQ0p1Sm-IrFsWuaBdXD1ixn9_q1",
  },
  {
    id: 2,
    title: "For Coach",
    description: "Guides and tips designed for coaches.",
    embedUrl:
      "https://www.youtube.com/embed/videoseries?list=PL26PXKDQ0p1TDzfEC0fYH7y58cFqWYdlL",
  },
  {
    id: 3,
    title: "Innovation Project",
    description: "Showcase of creative innovation projects.",
    embedUrl:
      "https://www.youtube.com/embed/videoseries?list=PL26PXKDQ0p1T_dbxuuyO2GFE7CbEDRoCh",
  },
  {
    id: 4,
    title: "For Programming",
    description: "Programming lessons and tutorials.",
    embedUrl:
      "https://www.youtube.com/embed/videoseries?list=PL26PXKDQ0p1Td1cgPxx--skcPnbrMfBDu",
  },
  {
    id: 5,
    title: "For Robot Game",
    description: "Gameplay and strategies for robot competitions.",
    embedUrl:
      "https://www.youtube.com/embed/videoseries?list=PL26PXKDQ0p1TvOHv3ERTtnqkt6aUW62rL",
  },
  {
    id: 6,
    title: "Building Attachments",
    description: "Learn how to build robot attachments.",
    embedUrl:
      "https://www.youtube.com/embed/videoseries?list=PL26PXKDQ0p1TvOHv3ERTtnqkt6aUW62rL",
  },
];

ConnectDB()
  .then(async () => {
    console.log("MongoDB connected");

    // Clear collections
    await Download.deleteMany({});
    await Video.deleteMany({});

    // Seed data
    await Download.insertMany(downloadsData);
    await Video.insertMany(videosData);

    console.log("Database seeded!");
    process.exit();
  })
  .catch(err => console.error(err));

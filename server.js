import dotenv from "dotenv";
dotenv.config(); // MUST be first

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/connectMongo.js";

// Import Routes
import slideRoutes from "./routes/slideRoutes.js";
import championRoutes from "./routes/ChampionsRoute.js";
import downloadsRoutes from "./routes/downloadRouter.js";
import videoRoutes from "./routes/videoRoutes.js";
import missionVisionRoutes from "./routes/MissionVisionRoute.js";
import chatRoutes from "./routes/chatRoute.js";
import getInvolvedRoute from "./routes/getInvolvedRoute.js";
import supportRoutes from "./routes/supportRoute.js";
import sponsorRoutes from "./routes/sponsorRoutes.js";
import teamRoutes from "./routes/teamRoute.js";
import processRoutes from "./routes/recruitingRoute.js";
import educationRoutes from "./routes/educationRoute.js";
import projectSlideRoutes from "./routes/carouserRoute.js";
import donationImageRoutes from "./routes/donationImageRoute.js";
import emailRoutes from "./routes/EmailsRoute.js";
import galleryRoutes from "./routes/galleryRoute.js";
import testimonialsRoutes from "./routes/commentsRoutes.js";
import authRoutes from "./routes/AuthRoutes.js";
import adminRoutes from "./routes/AdminRoutes.js";
import paymentRoutes from "./routes/DonationPaymentRoute.js";

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Enable CORS for frontend
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

// Parse JSON
app.use(express.json());

// Debug logs
console.log("✅ Mongo URI:", process.env.MONGO_URI ? "Loaded" : "Missing");
console.log("✅ JWT Secret:", process.env.JWT_SECRET ? "Loaded" : "Missing");

// __dirname setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/api/chat", chatRoutes);
app.use("/api/slides", slideRoutes);
app.use("/api/mission-vision", missionVisionRoutes);
app.use("/api/champions", championRoutes);
app.use("/api/downloads", downloadsRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/getinvolved", getInvolvedRoute);
app.use("/api/support", supportRoutes);
app.use("/api/sponsors", sponsorRoutes);
app.use("/api/team", teamRoutes);
app.use("/api/process", processRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/project-slides", projectSlideRoutes);
app.use("/api/donation-images", donationImageRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/testimonials", testimonialsRoutes);
app.use("/api/payments", paymentRoutes);


// Auth/Admin Routes
app.use("/api/admin", authRoutes);
app.use("/api/admin", adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

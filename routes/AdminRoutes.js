import express from "express";
import { changePassword } from "../controllers/AdminController.js";
import { protect } from "../middleware/authMidleware.js";

const router = express.Router();

router.put("/change-password", protect, changePassword);

export default router;

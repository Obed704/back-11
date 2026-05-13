import express from "express";
import rateLimit from "express-rate-limit";
import {
    loginAdmin,
    verifyEmailCode,
    resendVerificationCode,
    refreshAccessToken,
    logoutAdmin,
    getProfile,
    changePassword,
} from "../controllers/AuthController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: "Too many login attempts. Try again in 15 minutes." },
});

const verifyLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 5,
    message: { message: "Too many verification attempts. Try again in 5 minutes." },
});

const resendLimiter = rateLimit({
    windowMs: 2 * 60 * 1000,
    max: 3,
    message: { message: "Too many resend requests. Wait 2 minutes." },
});

router.post("/login", loginLimiter, loginAdmin);
router.post("/verify-email", verifyLimiter, verifyEmailCode);
router.post("/resend-code", resendLimiter, resendVerificationCode);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", protect, logoutAdmin);
router.get("/profile", protect, getProfile);
router.put("/change-password", protect, changePassword);

export default router;
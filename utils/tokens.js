import jwt from "jsonwebtoken";

export const signAccessToken = (admin) =>
    jwt.sign(
        { id: admin._id, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    );

export const signPreAuthToken = (admin) =>
    jwt.sign(
        { id: admin._id, phase: "2fa" },
        process.env.JWT_SECRET,
        { expiresIn: "5m" }
    );

export const signRefreshToken = (admin, deviceId) =>
    jwt.sign(
        { id: admin._id, deviceId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: "7d" }
    );
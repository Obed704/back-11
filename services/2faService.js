import speakeasy from "speakeasy";
import nodemailer from "nodemailer";

// SMS placeholder (Twilio-ready)
export const sendSMS = async (phone, code) => {
    console.log(`SMS to ${phone}: ${code}`);
};

// Email OTP
export const sendEmailOTP = async (email, code) => {
    console.log(`Email OTP to ${email}: ${code}`);
};

export const verifyTOTP = (secret, token) => {
    return speakeasy.totp.verify({
        secret,
        encoding: "base32",
        token,
        window: 1,
    });
};
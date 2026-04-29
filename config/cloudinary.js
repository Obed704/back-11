import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Startup validation
const { cloud_name, api_key, api_secret } = cloudinary.config();
if (!cloud_name || !api_key || !api_secret) {
    console.error("❌ Cloudinary config incomplete:");
    console.error("   CLOUDINARY_CLOUD_NAME:", cloud_name ? "✓" : "MISSING");
    console.error("   CLOUDINARY_API_KEY:   ", api_key ? "✓" : "MISSING");
    console.error("   CLOUDINARY_API_SECRET:", api_secret ? "✓" : "MISSING");
} else {
    console.log("☁️  Cloudinary ready:", cloud_name);
}

const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
        folder: "champions",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 1000, crop: "limit" }],
        format: "jpg",
        public_id: `${Date.now()}-${file.originalname
            .replace(/\.[^/.]+$/, "")
            .replace(/[^a-zA-Z0-9_-]/g, "_")
            .slice(0, 60)}`,
    }),
});

export const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only image files are allowed"), false);
        }
        cb(null, true);
    },
});

export default cloudinary;
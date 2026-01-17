import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/support"));
  },
  filename: function (req, file, cb) {
    // Prepend timestamp to make filename unique
    const unique = Date.now() + "-" + file.originalname;
    cb(null, unique);
  },
});

// Multer instance
const upload = multer({ storage });

export default upload;

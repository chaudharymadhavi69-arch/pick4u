import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js"; // Cloudinary config

// Cloudinary storage setup
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "pick4u/kyc", // Folder in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "pdf"],
    transformation: [{ width: 800, crop: "limit" }],
  },
});

// Multer upload middleware
export const upload = multer({ storage });

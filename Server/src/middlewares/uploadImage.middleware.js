import multer from "multer";
import sharp from "sharp";
import cloudinary from "../config/cloudinary.config.js";

// Memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder = "listings") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
};

// Middleware: Resize + Upload
export const processAndUploadImages = (options = {}) => {
  const { singleField = "profilePic", multiField = "photos" } = options;

  return async (req, res, next) => {
    try {
      const files = req.files || (req.file ? [req.file] : []);
      if (!files || files.length === 0) return next();

      const width = parseInt(req.body.width) || 600;
      const height = parseInt(req.body.height) || 600;
      const quality = parseInt(req.body.quality) || 90;

      const uploadedUrls = [];

      for (const file of files) {
        const resizedBuffer = await sharp(file.buffer)
          .resize(width, height, { fit: "cover" })
          .toFormat("jpeg")
          .jpeg({ quality })
          .toBuffer();

        // Decide folder automatically
        const fieldName = file.fieldname;
        const folderName =
          fieldName === "profilePic" ? "profilePics" : "listings";

        const uploadResult = await uploadToCloudinary(
          resizedBuffer,
          folderName
        );
        uploadedUrls.push(uploadResult.secure_url);
      }

      // Detect single vs multiple
      if (
        req.file ||
        (files.length === 1 && req.route.path.includes("users"))
      ) {
        req.body[singleField] = uploadedUrls[0];
      } else {
        req.body[multiField] = uploadedUrls;
      }

      console.log("Uploaded URLs:", uploadedUrls);
      next();
    } catch (err) {
      console.error("Upload Error:", err);
      res.status(500).json({
        status: "Failed",
        message: "Image upload failed",
        error: err.message,
      });
    }
  };
};

export default upload;

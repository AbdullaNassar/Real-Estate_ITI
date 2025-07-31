import multer from "multer";
import sharp from "sharp";
import cloudinary from "../config/cloudinary.config.js";

// Memory storage for multer
const upload = multer({ storage: multer.memoryStorage() });

// Upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder = "listings", format = "auto") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );    

    stream.end(buffer);
  });
};

// Middleware to process and upload images
export const processAndUploadImages = (options = {}) => {
  const {
    singleField = "profilePic",
    multiField = "photos",
    resize = true,
    defaultFolder = "uploads",
    folderMap = {
      profilePic: "profilePics",
      icon: "icons",
      photos: "listings",
    },
  } = options;

  return async (req, res, next) => {
    try {
      const files = req.files || (req.file ? [req.file] : []);
      if (!files || files.length === 0) return next();

      const uploadedUrls = [];

      // Supported image MIME types
      const acceptedTypes = [
        "image/svg+xml",
        "image/jpeg",
        "image/png",
        "image/avif",
        "image/webp",
      ];

      const width = parseInt(req.body.width) || 600;
      const height = parseInt(req.body.height) || 600;
      const quality = parseInt(req.body.quality) || 90;

      for (const file of files) {
        const { fieldname, mimetype, buffer } = file;

        if (!acceptedTypes.includes(mimetype)) {
          return res.status(400).json({
            status: "Failed",
            message: `File type ${mimetype} is not allowed. Allowed types: ${acceptedTypes.join(", ")}`,
          });
        }

        const isSVG = mimetype === "image/svg+xml";
        let bufferToUpload = buffer;
        if (isSVG && typeof buffer !== "object") {
          bufferToUpload = Buffer.from(buffer.toString(), "utf-8");
        }
        let format = isSVG ? "svg" : mimetype.split("/")[1];

        // Resize only non-SVG formats
        if (!isSVG && resize) {
          const resizedImage = sharp(buffer)
            .resize(width, height, { fit: "cover" })
            .toFormat("jpeg")
            .jpeg({ quality });

          bufferToUpload = await resizedImage.toBuffer();
          format = "jpeg";
        }

        const folderName = folderMap[fieldname] || defaultFolder;        

        const uploadResult = await uploadToCloudinary(
          bufferToUpload,
          folderName,
          format
        );                

        uploadedUrls.push(uploadResult.secure_url);
      }

      const isSingle =
        req.file || (files.length === 1 && req.route?.path?.includes("users"));

      if (isSingle) {
        req.body[singleField] = uploadedUrls[0];
      } else {
        req.body[multiField] = uploadedUrls;
      }

      next();
    } catch (error) {
      res.status(500).json({
        status: "Failed",
        message: "Image upload failed",
        error: error.message,
      });
    }
  };
};

export default upload;

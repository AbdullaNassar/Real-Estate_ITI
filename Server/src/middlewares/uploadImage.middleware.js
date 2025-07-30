import multer from "multer";
import sharp from "sharp";
import cloudinary from "../config/cloudinary.config.js";

// Memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder = "listings", format = "auto") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        format,
        allowed_formats: ["svg", "jpg", "jpeg", "png"],
        transformation: { format: 'svg' }
      },
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
  const {
    singleField = "profilePic",
    multiField = "photos",
    resize = true, // allow turning off resizing
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
      
      // Validate file types
      for (const file of files) {
        const acceptedTypes = ['image/svg+xml', 'image/jpeg', 'image/png'];
        if (!acceptedTypes.includes(file.mimetype)) {
          return res.status(400).json({
            status: "Failed",
            message: `File type ${file.mimetype} is not allowed. Only SVG, JPEG, and PNG files are allowed`,
          });
        }
      }

      // Set width and height based on file type
      const width = parseInt(req.body.width) || 600;
      const height = parseInt(req.body.height) || 600;
      const quality = parseInt(req.body.quality) || 90;

      for (const file of files) {
        const { fieldname, mimetype, buffer } = file;

        const isSVG = (mimetype === "image/svg+xml");
        let bufferToUpload = buffer;
        let format = isSVG ? "svg" : "jpeg";

        // Only resize non-SVG images when resize option is true
        if (!isSVG && resize) {
          bufferToUpload = await sharp(buffer)
            .resize(width, height, { fit: "cover" })
            .toFormat("jpeg")
            .jpeg({ quality })
            .toBuffer();
        }

        const folderName = folderMap[fieldname] || defaultFolder;

        const uploadResult = await uploadToCloudinary(
          bufferToUpload,
          folderName,
          format
        );

        uploadedUrls.push(uploadResult.secure_url);
      }

      // Set uploaded URLs into req.body
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

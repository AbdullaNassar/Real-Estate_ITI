import multer from 'multer';
import sharp from 'sharp';
import cloudinary from '../config/cloudinary.config.js';

// Memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Upload buffer to Cloudinary
const uploadToCloudinary = (buffer, folder = 'listings') => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
        });
        stream.end(buffer);
    });
    };

// Middleware: Resize + Upload
export const processAndUploadImages = async (req, res, next) => {
try {
    if (!req.files || req.files.length === 0) {
    return next(); // No images uploaded
    }
    // Dynamic parameters (can be sent as query or body)
    const width = parseInt(req.body.width) || 800;
    const height = parseInt(req.body.height) || 600;
    const quality = parseInt(req.body.quality) || 80;

    const uploadedUrls = [];

    for (const file of req.files) {
    const resizedBuffer = await sharp(file.buffer)
        .resize(width, height, { fit: 'cover' })
        .toFormat('jpeg')
        .jpeg({ quality })
        .toBuffer();

    const uploadResult = await uploadToCloudinary(resizedBuffer);
    uploadedUrls.push(uploadResult.secure_url);
    }

    req.body.photos = uploadedUrls; // Ensure it matches DB field
    next();
} catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({
        status:"Failed",
        message: 'Image upload failed',
        error: err.message 
    });
}
};

export default upload;
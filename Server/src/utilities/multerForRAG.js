import multer from "multer";

// Configure multer for file upload
const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        console.log('Processing file:', file.originalname, 'Mimetype:', file.mimetype);
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword'
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type: ${file.mimetype}. Only PDF and Word documents are allowed.`));
        }
    }
});

export default upload;
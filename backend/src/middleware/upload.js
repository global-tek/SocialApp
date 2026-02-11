const multer = require('multer');
const path = require('path');

// Configure multer for memory storage (we'll upload to Cloudinary)
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types - including HEIC/HEIF for iPhone
  const allowedTypes = /jpeg|jpg|png|gif|heic|heif|webp|mp4|mov|avi|quicktime/;
  
  // Check extension
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  
  // Check mime type - be more lenient for mobile uploads
  const mimetype = allowedTypes.test(file.mimetype.toLowerCase()) || 
                   file.mimetype.startsWith('image/') || 
                   file.mimetype.startsWith('video/');

  if (mimetype || extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only images and videos are allowed'));
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  },
  fileFilter: fileFilter
});

module.exports = upload;

const fs = require('fs');
const createHttpError = require('http-errors');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { ERROR_MESSAGES } = require('../api/v1/helpers/variables');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});
const uploadImage = multer({
  dest: 'uploads/',
  fileFilter: async (req, file, cb) => {
    if (
      !['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'].includes(file.mimetype)
    )
      return cb(new Error(ERROR_MESSAGES.MEDIA.INCORRECT_TYPE));
    return cb(null, true);
  },
  limits: {
    fileSize: 1024 * 60,
    files: 4,
  },
}).single('image');

function middlewareUploadImage(req, res, next) {
  uploadImage(req, res, async function (err) {
    console.log(err);
    if (err instanceof multer.MulterError) {
      next(createHttpError.BadRequest(err.message));
    } else if (err) {
      next(
        createHttpError.InternalServerError(err.message || 'Cannot upload image, please try later'),
      );
    }
    next();
  });
}

module.exports = { middlewareUploadImage, uploadImage, cloudinary };

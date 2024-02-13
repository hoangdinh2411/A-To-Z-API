const createHttpError = require('http-errors');
const { cloudinary } = require('../../../../plugins/upload-plugin');
const { getFolderNameByMonth } = require('../../helpers');
const fs = require('fs');
const { ERROR_MESSAGES } = require('../../helpers/variables');
class MediaController {
  static async upload(req, res, next) {
    const folderName = getFolderNameByMonth();
    const company_slug = req.payload.slug;
    return cloudinary.uploader
      .upload(req.file.path, {
        resource_type: 'auto',
        folder: `${company_slug}/${folderName}`,
        unique_filename: true,
        use_filename: false,
      })
      .then((result, error) => {
        if (error) return next(createHttpError.InternalServerError(error.message));
        fs.unlink(req.file.path, (err) => {
          if (err) return next(createHttpError.InternalServerError(err.message));
          return res.status(200).json({
            success: true,
            data: {
              public_id: result.public_id,
              url: result.secure_url,
            },
          });
        });
      });
  }

  static delete(req, res, next) {
    if (!req.body.public_id)
      return next(createHttpError.BadRequest(ERROR_MESSAGES.MEDIA.MISSING_PUBLIC_ID));
    return cloudinary.uploader
      .destroy(req.body.public_id, {
        resource_type: 'image',
      })
      .then((response) => {
        if (response.result !== 'ok')
          return next(
            createHttpError.InternalServerError(ERROR_MESSAGES.MEDIA.DESTROY_IMAGE_FAILED),
          );
        return res.status(200).json({
          success: true,
        });
      });
  }

  static async destroyImages(public_ids = []) {
    if (public_ids.length === 0) return;
    Promise.all(
      public_ids.map(async (public_id) => {
        await cloudinary.uploader.destroy(public_id, {
          resource_type: 'image',
        });
      }),
    ).then((response) => {
      if (response.result !== 'ok')
        throw new Error(ERROR_MESSAGES.MEDIA.DESTROY_IMAGE_FAILED + response.result);
    });
  }
}

module.exports = MediaController;

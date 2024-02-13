const express = require('express');
const { middlewareUploadImage } = require('../../../../plugins/upload-plugin');
const MediaController = require('../../controllers/admin/media-controller');
const { checkPermission } = require('../../middlewares/auth-middleware');
const { HIGH_LEVEL_PERMISSION_GROUP } = require('../../helpers/auth-helper');
const router = express.Router();

router.post(
  '/image/upload',
  checkPermission([...HIGH_LEVEL_PERMISSION_GROUP, 'PARTNER_UPLOAD_IMAGE', 'ADMIN_UPLOAD_IMAGE']),
  middlewareUploadImage,
  MediaController.upload,
);
router.put(
  '/image/destroy',
  checkPermission([...HIGH_LEVEL_PERMISSION_GROUP, 'PARTNER_DESTROY_IMAGE', 'ADMIN_DESTROY_IMAGE']),
  MediaController.delete,
);

module.exports = router;

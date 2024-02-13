const express = require('express');
const ProductsController = require('../../controllers/partner/product-controller');
const { checkPermission } = require('../../middlewares/auth-middleware');
const { HIGH_LEVEL_PERMISSION_GROUP } = require('../../helpers/auth-helper');
const { middlewareUploadImage } = require('../../../../plugins/upload-plugin');
const router = express.Router();
router.get(
  '/:product_id',
  checkPermission([...HIGH_LEVEL_PERMISSION_GROUP, 'PARTNER_PRODUCT_READ', 'ADMIN_PRODUCT_READ']),
  ProductsController.getProductById,
);
router.get(
  '/',
  checkPermission([...HIGH_LEVEL_PERMISSION_GROUP, 'PARTNER_PRODUCT_READ', 'ADMIN_PRODUCT_READ']),
  ProductsController.getAll,
);

router.post('/',middlewareUploadImage, checkPermission(['PARTNER_PRODUCT_CREATE']), ProductsController.add);
router.put('/:product_id', checkPermission(['PARTNER_PRODUCT_UPDATE']), ProductsController.update);
router.put(
  '/approve/:product_id',
  checkPermission([...HIGH_LEVEL_PERMISSION_GROUP, 'ADMIN_PRODUCT_APPROVE']),
  ProductsController.approve,
);
router.delete(
  '/:product_id',
  checkPermission([
    ...HIGH_LEVEL_PERMISSION_GROUP,
    'PARTNER_PRODUCT_DELETE',
    'ADMIN_PRODUCT_DELETE',
  ]),
  ProductsController.delete,
);

module.exports = router;

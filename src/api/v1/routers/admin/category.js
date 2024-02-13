const express = require('express');
const CategoryController = require('../../controllers/admin/category-controller');
const { checkPermission } = require('../../middlewares/auth-middleware');
const { HIGH_LEVEL_PERMISSION_GROUP } = require('../../helpers/auth-helper');
const router = express.Router();

router.post(
  '/',
  checkPermission([...HIGH_LEVEL_PERMISSION_GROUP, 'ADMIN_CATEGORY_CREATE']),
  CategoryController.create,
);
router.delete(
  '/:category_id',
  checkPermission([...HIGH_LEVEL_PERMISSION_GROUP, 'ADMIN_CATEGORY_DELETE']),
  CategoryController.delete,
);
router.post(
  '/subcategories',
  checkPermission([...HIGH_LEVEL_PERMISSION_GROUP, 'ADMIN_SUBCATEGORY_CREATE']),
  CategoryController.addSubcategories,
);
router.delete(
  '/subcategories/:subcategory_id',
  checkPermission([...HIGH_LEVEL_PERMISSION_GROUP, 'ADMIN_SUBCATEGORY_DELETE']),
  CategoryController.deleteSubcategory,
);
module.exports = router;

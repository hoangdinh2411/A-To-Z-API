const express = require('express');
const RoleController = require('../../controllers/admin/role-controller');
const { checkPermission } = require('../../middlewares/auth-middleware');
const { HIGH_LEVEL_PERMISSION_GROUP } = require('../../helpers/auth-helper');
const router = express.Router();

router.get('/', checkPermission([...HIGH_LEVEL_PERMISSION_GROUP]), RoleController.getAll);
router.post('/', checkPermission([...HIGH_LEVEL_PERMISSION_GROUP]), RoleController.create);
router.put(
  '/',
  checkPermission([...HIGH_LEVEL_PERMISSION_GROUP]),
  RoleController.updatePermissionList,
);

module.exports = router;

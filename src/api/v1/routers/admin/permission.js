const express = require('express');
const PermissionController = require('../../controllers/admin/permission-controller');
const { checkPermission } = require('../../middlewares/auth-middleware');
const { HIGH_LEVEL_PERMISSION_GROUP } = require('../../helpers/auth-helper');
const router = express.Router();

router.get('/', checkPermission([...HIGH_LEVEL_PERMISSION_GROUP]), PermissionController.getAll);

router.post('/', checkPermission([...HIGH_LEVEL_PERMISSION_GROUP]), PermissionController.create);

module.exports = router;

const express = require('express');
const AdminAuthController = require('../../controllers/admin/auth-controller');
const RoleController = require('../../controllers/admin/role-controller');
const PermissionController = require('../../controllers/admin/permission-controller');
const router = express.Router();

router.post('/login', AdminAuthController.login);
// for development only, when creating super admin without check token or permission
router.post('/super-admin/role', RoleController.createSuperAdminRole);
router.post('/super-admin/permission', PermissionController.createAdministratorPermission);
router.post('/super-admin/register', AdminAuthController.registerSuperAdmin);
module.exports = router;

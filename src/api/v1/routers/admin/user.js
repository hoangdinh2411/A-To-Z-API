const express = require('express');
const AdminAuthController = require('../../controllers/admin/auth-controller');
const { checkPermission } = require('../../middlewares/auth-middleware');
const { HIGH_LEVEL_PERMISSION_GROUP } = require('../../helpers/auth-helper');
const router = express.Router();

router.post(
  '/register/partner',
  checkPermission([...HIGH_LEVEL_PERMISSION_GROUP, 'ADMIN_ACCOUNT_CREATE']),
  AdminAuthController.createPartnerAccount,
);
router.post(
  '/register',
  checkPermission([...HIGH_LEVEL_PERMISSION_GROUP, 'ADMIN_ACCOUNT_CREATE']),
  AdminAuthController.register,
);

router.get(
  '/profile',
  checkPermission([...HIGH_LEVEL_PERMISSION_GROUP, 'ADMIN_PROFILE_READ', 'PARTNER_PROFILE_READ']),
  AdminAuthController.getProfile,
);

router.put(
  '/profile',
  checkPermission([...HIGH_LEVEL_PERMISSION_GROUP, 'ADMIN_PROFILE_UPDATE']),
  AdminAuthController.updateProfileForAdmin,
);
router.get('/logout', AdminAuthController.logout);

module.exports = router;

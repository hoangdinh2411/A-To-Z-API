const express = require('express');
const PartnerAuthController = require('../../controllers/partner/auth-controller');
const { checkPermission } = require('../../middlewares/auth-middleware');
const { HIGH_LEVEL_PERMISSION_GROUP } = require('../../helpers/auth-helper');
const PartnerManagerController = require('../../controllers/admin/partner-controller');
const router = express.Router();

router.put(
  '/profile',
  checkPermission(['PARTNER_PROFILE_READ']),
  PartnerAuthController.updateProfile,
);
router.get(
  '/all',
  checkPermission([...HIGH_LEVEL_PERMISSION_GROUP, 'ADMIN_PARTNER_READ']),
  PartnerManagerController.getPartners,
);
router.put(
  '/:partner_id/status',
  checkPermission([...HIGH_LEVEL_PERMISSION_GROUP, 'ADMIN_PARTNER_UPDATE_STATUS']),
  PartnerManagerController.changeStatusPartnerAccount,
);
module.exports = router;

const express = require('express');
const ContractController = require('../../controllers/admin/contract-controller');
const { checkPermission } = require('../../middlewares/auth-middleware');
const { HIGH_LEVEL_PERMISSION_GROUP } = require('../../helpers/auth-helper');
const router = express.Router();

router.post(
  '/',
  checkPermission([...HIGH_LEVEL_PERMISSION_GROUP, 'ADMIN_CONTRACT_CREATE']),
  ContractController.create,
);
module.exports = router;

const express = require('express');
const router = express.Router();
const partnerRouter = require('./partner');
const categoryRouter = require('./category');
const userRouter = require('./user');
const productRouter = require('./product');
const contractRouter = require('./contract');
const mediaRouter = require('./media');
const roleRouter = require('./role');
const permissionRouter = require('./permission');
const { checkPermission } = require('../../middlewares/auth-middleware');
const { HIGH_LEVEL_PERMISSION_GROUP } = require('../../helpers/auth-helper');
router.use('/', userRouter);
router.use('/partner', partnerRouter);
router.use('/category', categoryRouter);
router.use('/products', productRouter);
router.use('/contracts', contractRouter);
router.use(
  '/media',
  (req, res, next) => {
    res.header('Content-Type', 'multipart/form-data');
    next();
  },
  mediaRouter,
);
router.use('/role', checkPermission(HIGH_LEVEL_PERMISSION_GROUP), roleRouter);
router.use('/permission', checkPermission(HIGH_LEVEL_PERMISSION_GROUP), permissionRouter);
module.exports = router;

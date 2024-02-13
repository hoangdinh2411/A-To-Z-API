const clientRouter = require('./client');
const adminRouter = require('./admin');
const authRouter = require('./admin/auth');
const { authMiddleware } = require('../middlewares/auth-middleware');
module.exports = function (app) {
  app.use('/', clientRouter);

  app.use('/admin', authRouter);
  app.use('/admin', authMiddleware);
  app.use('/admin', adminRouter);
  app.use('/test', (req, res) => {
    return res.status(200).json({ message: 'test success' });
  });
};

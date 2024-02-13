const createHttpError = require('http-errors');
const { authHelper } = require('../helpers/auth-helper');
const UserModel = require('../models/user-model');
const { ERROR_MESSAGES } = require('../helpers/variables');

const getTokenFromHeaders = (req) => {
  const {
    headers: { authorization },
  } = req;
  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    let token = authorization.split(' ')[1];
    req.token = token;
    return token;
  }
  return null;
};

async function authMiddleware(req, res, next) {
  let token = getTokenFromHeaders(req);
  if (!token) return next(createHttpError.Unauthorized(ERROR_MESSAGES.AUTH.MISSING_TOKEN));
  let { payload, err } = authHelper.validateToken(token);
  if (err) return next(createHttpError.Unauthorized(err.message));
  if (!payload) return next(createHttpError.Unauthorized(ERROR_MESSAGES.AUTH.INVALID_TOKEN));
  const user = await UserModel.findOne({
    _id: payload.id,
    status: {
      $in: ['active', 'pending'],
    },
    token,
  }).populate({
    path: 'role',
    populate: {
      path: 'permissions',
      select: 'value',
    },
  });

  if (!user) return next(createHttpError.Unauthorized(ERROR_MESSAGES.AUTH.INVALID_TOKEN));
  req.payload = user;
  next();
}
const checkPermission = (requiredPermissions = []) => {
  return async function (req, res, next) {
    const user = req.payload;
    const user_permissions = user.role.permissions || [];

    const hasPermission = user_permissions.some((p) => requiredPermissions.indexOf(p.value) >= 0);
    if (hasPermission) return next();
    return next(createHttpError.Unauthorized(ERROR_MESSAGES.AUTH.PERMISSION_DENIED));
  };
};
module.exports = { checkPermission, authMiddleware };

const jwt = require('jsonwebtoken');
const createHttpError = require('http-errors');

const authHelper = {
  validateToken: function (token) {
    try {
      let result = {};

      jwt.verify(token, process.env.JWT_SECRET, async function (err, decoded) {
        if (err) {
          result = { payload: null, err };
        } else {
          result = { payload: decoded };
        }
      });

      return result;
    } catch (error) {
      console.error('validateToken', error);
      return createHttpError.Unauthorized(error.message);
    }
  },
  generateToken: async function ({ payload }) {
    try {
      let expiresIn = '1d';
      let options = { expiresIn };
      let token = jwt.sign(payload, process.env.JWT_SECRET, options);
      return token;
    } catch (error) {
      console.log(' set token error:::', error);
      return createHttpError.InternalServerError(error);
    }
  },
};

const HIGH_LEVEL_PERMISSION_GROUP = ['ADMINISTRATOR'];
module.exports = {
  authHelper,
  HIGH_LEVEL_PERMISSION_GROUP,
};

const createHttpError = require('http-errors');
const PermissionModel = require('../../models/permission-model');
const authValidation = require('../../validations/auth-validate');
const helpers = require('../../helpers');
const { ERROR_MESSAGES } = require('../../helpers/variables');
class PermissionController {
  static async createAdministratorPermission(req, res, next) {
    try {
      let permission = new PermissionModel({
        title: 'Administrator',
        value: 'ADMINISTRATOR',
      });
      await permission.save();
      return res.status(201).json({
        success: true,
      });
    } catch (error) {
      if (error.code === 11000) {
        return next(createHttpError.Conflict(ERROR_MESSAGES.PERMISSION.EXISTING));
      }
      return next(createHttpError.BadRequest(error.message));
    }
  }
  static async create(req, res, next) {
    try {
      await authValidation.permission.validate(req.body);
      let permission = new PermissionModel({
        title: helpers.formatFrom(req.body.title),
        value: helpers.formatFrom(req.body.title),
      });
      await permission.save();
      return res.status(201).json({
        success: true,
      });
    } catch (error) {
      if (error.code === 11000) {
        return next(createHttpError.Conflict(ERROR_MESSAGES.PERMISSION.EXISTING));
      }
      return next(createHttpError.BadRequest(error.message));
    }
  }
  static async getAll(req, res, next) {
    try {
      let permissions = await PermissionModel.find({}).select('-__v');
      if (!permissions) permissions = [];
      return res.status(200).json({
        success: true,
        data: permissions,
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
    }
  }
}

module.exports = PermissionController;

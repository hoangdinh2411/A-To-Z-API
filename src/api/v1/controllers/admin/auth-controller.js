const createHttpError = require('http-errors');
const UserModel = require('../../models/user-model');
const authValidation = require('../../validations/auth-validate');
const profileValidation = require('../../validations/profile-validate');
const { authHelper } = require('../../helpers/auth-helper');
const RoleModel = require('../../models/role-model');
const { ERROR_MESSAGES } = require('../../helpers/variables');
class AdminAuthController {
  static async register(req, res, next) {
    try {
      await authValidation.register.validate(req.body);
      const role = await RoleModel.findOne({
        _id: req.body.role,
      });

      if (!role) return next(createHttpError.NotFound(ERROR_MESSAGES.ROLE.NOT_FOUND));

      let admin = new UserModel({
        ...req.body,
        company_name: req.payload.company_name,
        email: req.payload.email,
        description: req.payload.description,
        main_office: req.payload.main_office,
        phone: req.payload.phone,
        office: req.payload.office,
      });

      admin.setPassword(req.body.password);
      await admin.save();
      return res.status(201).json({
        success: true,
      });
    } catch (error) {
      if (error.code === 11000) {
        return next(createHttpError.Conflict(ERROR_MESSAGES.USER.EXISTING));
      }
      return next(createHttpError.BadRequest(error.message));
    }
  }
  static async registerSuperAdmin(req, res, next) {
    try {
      await authValidation.register.validate(req.body);
      let admin = new UserModel(req.body);

      admin.setPassword(req.body.password);
      await admin.save();
      return res.status(201).json({
        success: true,
      });
    } catch (error) {
      if (error.code === 11000) {
        return next(createHttpError.Conflict(ERROR_MESSAGES.USER.EXISTING));
      }
      return next(createHttpError.BadRequest(error.message));
    }
  }
  static async login(req, res, next) {
    try {
      await authValidation.login.validate(req.body);
      const user = await UserModel.findOne({
        username: req.body.username,
      });
      if (!user) return next(createHttpError.BadRequest(ERROR_MESSAGES.AUTH.WRONG_USERNAME));
      if (user.status === 'inactive')
        return next(createHttpError.NotFound(ERROR_MESSAGES.USER.BANNED));
      const isPasswordValid = user.validatePassword(req.body.password);
      if (!isPasswordValid)
        return next(createHttpError.BadRequest(ERROR_MESSAGES.AUTH.WRONG_PASSWORD));
      const token = await authHelper.generateToken({
        payload: { id: user._id, status: user.status },
      });

      await UserModel.findOneAndUpdate(
        {
          _id: user._id,
        },
        {
          $set: {
            token,
          },
        },
        {
          new: true,
        },
      );

      return res.status(200).json({
        success: true,
        data: {
          token,
        },
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
    }
  }

  static async createPartnerAccount(req, res, next) {
    try {
      await authValidation.register.validate(req.body);
      const existing_username = await UserModel.findOne({ username: req.body.username });
      if (existing_username) return next(createHttpError.Conflict(ERROR_MESSAGES.USER.EXISTING));

      let partner = new UserModel({
        ...req.body,
        total_product: 0,
        total_transaction: 0,
      });

      partner.setPassword(req.body.password);
      await partner.save();
      return res.status(201).json({
        success: true,
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
    }
  }

  static async logout(req, res, next) {
    try {
      await UserModel.findOneAndUpdate(
        { _id: req.payload.id },
        {
          $set: {
            token: '',
          },
        },
        {
          new: true,
        },
      );
      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
    }
  }
  static async updateProfileForAdmin(req, res, next) {
    try {
      await profileValidation.admin.validate(req.body);
      const highLevelRole = await RoleModel.find({
        role_name: {
          $in: ['super_admin', 'admin'],
        },
      }).select('_id');

      let result = await UserModel.updateMany(
        {
          role: {
            $in: highLevelRole,
          },
          status: 'active',
        },
        {
          $set: {
            company_name: req.body.company_name,
            email: req.body.email,
            description: req.body.description,
            main_office: req.body.main_office,
            phone: req.body.phone,
            office: req.body.office,
          },
        },
        {
          new: true,
        },
      );
      if (!result) return next(createHttpError.NotFound(ERROR_MESSAGES.USER.NOT_FOUND));
      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
    }
  }

  static async getProfile(req, res, next) {
    try {
      const user = await UserModel.findOne({
        _id: req.payload.id,
      })
        .populate('role')
        .select('-__v -password -token')
        .lean();

      if (!user) return next(createHttpError.NotFound(ERROR_MESSAGES.USER.NOT_FOUND));
      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
    }
  }
}

module.exports = AdminAuthController;

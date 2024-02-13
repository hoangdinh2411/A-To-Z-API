const createHttpError = require('http-errors');
const profileValidation = require('../../validations/profile-validate');
const { generateSlugFrom } = require('../../helpers');
const UserModel = require('../../models/user-model');
const { ERROR_MESSAGES } = require('../../helpers/variables');
const { CategoryModel } = require('../../models/category-model');
class PartnerAuthController {
  static async updateProfile(req, res, next) {
    try {
      await profileValidation.partner.validate(req.body);
      const data = profileValidation.partner.cast(req.body);
      const existing_category = await CategoryModel.findOne({
        _id: req.body.category,
      });
      if (!existing_category)
        return next(createHttpError.NotFound(ERROR_MESSAGES.CATEGORY.NOT_FOUND));
      let result = await UserModel.findOneAndUpdate(
        {
          _id: req.payload.id,
        },
        {
          $set: {
            ...data,
            slug: generateSlugFrom(req.body.company_name),
            category: {
              category_name: existing_category.category_name,
              category_slug: existing_category.category_slug,
            },
          },
        },
        {
          new: true,
        },
      )
        .select('-password -__v -token')
        .populate('role')
        .lean();
      if (!result) return next(createHttpError.NotFound(ERROR_MESSAGES.USER.NOT_FOUND));
      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
    }
  }
}

module.exports = PartnerAuthController;

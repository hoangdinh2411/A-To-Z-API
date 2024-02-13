const createHttpError = require('http-errors');
const categoryValidation = require('../../validations/category-validate');
const { ERROR_MESSAGES } = require('../../helpers/variables');
const { SubcategoryModel } = require('../../models/subcategory-model');
const { CategoryModel } = require('../../models/category-model');
class CategoryController {
  static async create(req, res, next) {
    try {
      await categoryValidation.category.validate(req.body);
      let category = new CategoryModel(req.body);
      await category.save();
      return res.status(201).json({
        success: true,
        data: category,
      });
    } catch (error) {
      if (error.code === 11000) {
        return next(createHttpError.Conflict(ERROR_MESSAGES.CATEGORY.EXISTING));
      }
      return next(createHttpError.BadRequest(error.message));
    }
  }
  static async addSubcategories(req, res, next) {
    try {
      await categoryValidation.subcategories.validate(req.body);
      const category = await CategoryModel.findOne({ _id: req.body.category_id });
      if (!category) return next(createHttpError.NotFound(ERROR_MESSAGES.CATEGORY.NOT_FOUND));
      let new_subcategories = [];
      for (let index = 0; index < req.body.subcategories.length; index++) {
        let subcategory = new SubcategoryModel({
          subcategory_name: req.body.subcategories[index],
          category_slug: category.category_slug,
        });
        await subcategory.save();
        new_subcategories.push(subcategory);
      }

      const subcategories = new_subcategories.map((subcategory) => subcategory._id);
      await CategoryModel.findOneAndUpdate(
        {
          _id: req.body.category_id,
        },
        {
          $push: {
            subcategories,
          },
        },
        {
          new: true,
        },
      );
      return res.status(201).json({
        success: true,
        data: new_subcategories,
      });
    } catch (error) {
      if (error.code === 11000) {
        return next(
          createHttpError.Conflict(
            `${error.keyValue.subcategory_slug.toUpperCase().split('-').join(' ')} -- ${
              ERROR_MESSAGES.SUBCATEGORY.EXISTING
            }-`,
          ),
        );
      }
      return next(createHttpError.BadRequest(error.message));
    }
  }
  static async getAll(req, res, next) {
    try {
      let categories = await CategoryModel.find({})
        .select('-__v')
        .populate('subcategories', '-__v');
      return res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
    }
  }

  static async deleteSubcategory(req, res, next) {
    try {
      const subcategory = await SubcategoryModel.findOneAndDelete({
        _id: req.params.subcategory_id,
      });
      if (!subcategory) return next(createHttpError.NotFound(ERROR_MESSAGES.SUBCATEGORY.NOT_FOUND));

      await CategoryModel.findOneAndUpdate(
        {
          _id: subcategory.category_id,
        },
        {
          $pull: {
            subcategories: subcategory._id,
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

  static async delete(req, res, next) {
    try {
      const category = await CategoryModel.findOneAndDelete({
        _id: req.params.category_id,
      });
      if (!category) return next(createHttpError.NotFound(ERROR_MESSAGES.CATEGORY.NOT_FOUND));

      await SubcategoryModel.deleteMany({
        category_slug: category.category_slug,
      });

      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
    }
  }
}

module.exports = CategoryController;

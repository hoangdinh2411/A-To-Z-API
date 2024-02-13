const createHttpError = require('http-errors');
const ProductModel = require('../../models/product-model');
const productValidation = require('../../validations/product-validate');
const { generateSlugFrom } = require('../../helpers');
const logHelper = require('../../helpers/log-helper');
const { ERROR_MESSAGES } = require('../../helpers/variables');
const { SubcategoryModel } = require('../../models/subcategory-model');
const { default: mongoose } = require('mongoose');
const UserModel = require('../../models/user-model');
const MediaController = require('../admin/media-controller');

class ProductsController {
  static async add(req, res, next) {
    try {
      console.log(req.body)
      // await productValidation.validate(req.body);
      // const subcategory = await SubcategoryModel.findOne({
      //   _id: req.body.subcategory,
      // });
      // if (!subcategory)
      //   return next(createHttpError.BadRequest(ERROR_MESSAGES.SUBCATEGORY.NOT_FOUND));

      // let product = new ProductModel({
      //   ...req.body,
      //   company: req.payload.id,
      //   subcategory: subcategory,
      // });

      // await product.save();
      // await UserModel.findByIdAndUpdate(req.payload.id, {
      //   $inc: { total_product: 1 },
      // });
      return res.status(201).json({
        success: true,
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
    }
  }

  static async approve(req, res, next) {
    try {
      const product = await ProductModel.findByIdAndUpdate(req.params.product_id, {
        $set: {
          status: 'approved',
        },
      });
      if (!product) return next(createHttpError.NotFound(ERROR_MESSAGES.PRODUCT.NOT_FOUND));
      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
    }
  }

  static async getAll(req, res, next) {
    let limit = 10;
    let page = 1;
    let searchText = '';
    if (req.query.page) page = Number(req.query.page);
    if (req.query.search) searchText = req.query.search;
    try {
      const matchUnwind = [
        {
          $match: {
            status: {
              $in: ['pending', 'approved'],
            },
          },
        },
      ];
      if (req.payload.role.role_name.includes('partner')) {
        matchUnwind.push({
          $match: {
            company: new mongoose.Types.ObjectId(req.payload.id),
          },
        });
      }
      let matchSearching = [];
      if (searchText !== '') {
        matchSearching.push({
          $match: {
            $or: [
              { product_name: { $regex: searchText, $options: 'i' } },
              { 'subcategory.subcategory_name': { $regex: searchText, $options: 'i' } },
              { 'company.company_name': { $regex: searchText, $options: 'i' } },
              {
                status: {
                  $regex: searchText,
                  $options: 'i',
                },
              },
            ],
          },
        });
      }

      const products = await ProductModel.aggregate([
        ...matchUnwind,
        {
          $sort: {
            status: -1,
            createdAt: -1,
          },
        },
        {
          $lookup: {
            from: 'user',
            localField: 'company',
            foreignField: '_id',
            as: 'company',
            pipeline: [
              {
                $match: {
                  status: 'active',
                },
              },
              {
                $project: {
                  _id: 1,
                  company_name: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: '$company',
        },
        ...matchSearching,
        {
          $facet: {
            items: [{ $skip: (page - 1) * limit }, { $limit: limit }],
            pagination: [
              { $count: 'total' },
              {
                $addFields: {
                  pages: {
                    $ceil: {
                      $divide: ['$total', limit],
                    },
                  },
                },
              },
            ],
          },
        },
        {
          $project: {
            items: 1,
            pagination: {
              $arrayElemAt: ['$pagination', 0],
            },
          },
        },
      ]);

      return res.status(200).json({
        success: true,
        data: products[0],
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
    }
  }

  static async getProductById(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.product_id))
      return next(createHttpError.BadRequest(ERROR_MESSAGES.PRODUCT.NOT_FOUND));
    try {
      const product = await ProductModel.findById({
        _id: req.params.product_id,
      });
      if (!product) return next(createHttpError.NotFound(ERROR_MESSAGES.PRODUCT.NOT_FOUND));
      return res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
    }
  }
  static async update(req, res, next) {
    if (!mongoose.Types.ObjectId.isValid(req.params.product_id))
      return next(createHttpError.BadRequest(ERROR_MESSAGES.PRODUCT.NOT_FOUND));
    try {
      await productValidation.validate(req.body);
      const subcategory = SubcategoryModel.findById(req.body.subcategory);
      if (!subcategory)
        return next(createHttpError.BadRequest(ERROR_MESSAGES.SUBCATEGORY.NOT_FOUND));

      let product = await ProductModel.findOneAndUpdate(
        {
          _id: req.params.product_id,
          company: req.payload.id,
        },
        {
          $set: {
            ...req.body,
            slug: generateSlugFrom(req.body.product_name),
          },
        },
        {
          new: true,
          returnDocument: 'after',
        },
      );
      if (!product) return next(createHttpError.NotFound(ERROR_MESSAGES.PRODUCT.NOT_FOUND));
      return res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
    }
  }

  static async delete(req, res, next) {
    try {
      const product = await ProductModel.findById(req.params.product_id);
      if (!product) return next(createHttpError.NotFound(ERROR_MESSAGES.PRODUCT.NOT_FOUND));
      if (product.images.length > 0) {
        const public_ids = product.images.map((image) => image.public_id);
        await MediaController.destroyImages(public_ids);
      }
      await ProductModel.deleteOne({ _id: req.params.product_id });
      await UserModel.findByIdAndUpdate(req.payload.id, {
        $inc: { total_product: -1 },
      });
      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      error.message = logHelper.adjustErrorMessageWhenObjectIdInvalid(error);
      return next(createHttpError.BadRequest(error.message));
    }
  }
}

module.exports = ProductsController;

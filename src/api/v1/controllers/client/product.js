const createHttpError = require('http-errors');
const logHelper = require('../../helpers/log-helper');
const { ERROR_MESSAGES } = require('../../helpers/variables');

const ProductModel = require('../../models/product-model');

class ProductsControllerOnClient {
  static async getAllForClient(req, res, next) {
    let limit = 10;
    let page = 1;
    if (req.query.limit) limit = req.query.limit;
    if (req.query.page) page = req.query.page;
    try {
      let products = await ProductModel.aggregate([
        {
          $match: {
            status: 'approved',
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
                $project: {
                  company_name: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: '$company',
        },
        {
          $facet: {
            items: [{ $skip: (page - 1) * limit }, { $limit: limit }, { $project: { __v: 0 } }],
            pagination: [
              { $count: 'total' },
              {
                $addFields: {
                  page: page,
                  limit: limit,
                  total_page: {
                    $ceil: { $divide: ['$total', limit] },
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

  static async getProductBySlug(req, res, next) {
    try {
      const product = await ProductModel.findOne({
        slug: req.params.slug,
        status: 'approved',
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
  static async getProductsOfSubcategory(req, res, next) {
    let limit = 10;
    let page = 1;
    if (req.query.limit) limit = req.query.limit;
    if (req.query.page) page = req.query.page;
    try {
      const products = await ProductModel.aggregate([
        {
          $match: {
            'subcategory._id': req.params.subcategory_id,
            status: 'approved',
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
                $project: {
                  company_name: 1,
                },
              },
            ],
          },
        },
        {
          $unwind: '$company',
        },
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
      error.message = logHelper.adjustErrorMessageWhenObjectIdInvalid(error);
      return next(createHttpError.BadRequest(error.message));
    }
  }
}

module.exports = ProductsControllerOnClient;

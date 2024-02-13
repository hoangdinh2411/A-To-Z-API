const createHttpError = require('http-errors');
const { ERROR_MESSAGES } = require('../../helpers/variables');
const UserModel = require('../../models/user-model');
const { contractValidation } = require('../../validations/contract-validate');
const ProductModel = require('../../models/product-model');
const { ContractsModel } = require('../../models/contract-model');

class ContractController {
  static async create(req, res, next) {
    try {
      await contractValidation.validate(req.body);
      const company = await UserModel.findOne({
        _id: req.body.company,
      });
      if (!company) return next(createHttpError.BadRequest(ERROR_MESSAGES.USER.NOT_FOUND));

      const productIds = [...new Set(req.body.products.map((item) => item._id))];
      if (productIds.length !== req.body.products.length) {
        return next(createHttpError.BadRequest('Trùng sản phẩm'));
      }

      for (let i = 0; i < req.body.products.length; i++) {
        const product = await ProductModel.findOne({
          _id: req.body.products[i]._id,
          company: req.body.company,
        });
        if (!product)
          return next(
            createHttpError.BadRequest(
              req.body.products[i].product_name + ' không thuộc công ty này hoặc không tồn tại',
            ),
          );
      }

      const transaction = new ContractsModel({
        ...req.body,
        company: {
          _id: company._id,
          company_name: company.company_name,
        },
      });
      await transaction.save();
      return res.status(201).json({
        success: true,
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
    }
  }
}

module.exports = ContractController;

const createHttpError = require('http-errors');
const UserModel = require('../../models/user-model');
const { ERROR_MESSAGES } = require('../../helpers/variables');
class PartnerManagerController {
  static async getPartners(req, res, next) {
    let limit = 10;
    let page = 1;
    let searchText = '';
    if (req.query.page) page = Number(req.query.page);
    let matchUnwind = [];

    if (req.query.search) {
      searchText = req.query.search
      matchUnwind.push({
        $match: {
          $or: [
            { company_name: { $regex: searchText, $options: 'i' } },
            { email: { $regex: searchText, $options: 'i' } },
            { main_office: { $regex: searchText, $options: 'i' } },
            { office: { $regex: searchText, $options: 'i' } },
            { username: { $regex: searchText, $options: 'i' } },
            { phone: { $regex: searchText, $options: 'i' } },
          ],
        },
      });
    }
    try {
      const partners = await UserModel.aggregate([
        ...matchUnwind,
        {
          $lookup: {
            from: 'role',
            localField: 'role',
            foreignField: '_id',
            as: 'role',
            pipeline: [
              {
                $match: {
                  role_name: {
                    $nin:['admin','super_admin']
                  }
                },
              },
            ],
          },
        },
        {
          $unwind: '$role',
        },
        {
          $facet: {
            items: [
              { $skip: (page - 1) * limit },
              { $limit: limit },
              { $project: { __v: 0, token: 0, password: 0 } },
            ],
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
        data: partners[0],
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
    }
  }
  static async changeStatusPartnerAccount(req, res, next) {
    const { partner_id } = req.params;
    try {
      const partner = await UserModel.findOne({
        _id: partner_id,
      });
      if (!partner) return next(createHttpError.BadRequest(ERROR_MESSAGES.USER.NOT_FOUND));

      partner.status = partner.status === 'inactive' ? 'active' : 'inactive';
      await partner.save();

      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      return next(createHttpError.BadRequest(error.message));
    }
  }

  
}

module.exports = PartnerManagerController;

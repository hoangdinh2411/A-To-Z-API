const mongoose = require('mongoose');
const helpers = require('../helpers');

const subcategorySchema = new mongoose.Schema(
  {
    subcategory_name: {
      type: String,
      trim: true,
    },
    subcategory_slug: {
      type: String,
      unique: true,
      trim: true,
    },
    category_slug: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: false,
  },
);

subcategorySchema.pre('save', async function (next) {
  this.subcategory_slug = helpers.generateSlugFrom(this.subcategory_name);
  next();
});

const SubcategoryModel = mongoose.model('subcategory', subcategorySchema, 'subcategory');
module.exports = {
  SubcategoryModel,
  subcategorySchema,
};

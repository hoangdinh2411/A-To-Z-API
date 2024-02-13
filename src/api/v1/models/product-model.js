const mongoose = require('mongoose');
const helpers = require('../helpers');
const { subcategorySchema } = require('./subcategory-model');

const colorSchema = new mongoose.Schema(
  {
    color_name: {
      type: String,
      trim: true,
      required: true,
    },
    color_code: {
      type: String,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: false,
  },
);

const imageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      trim: true,
      required: true,
    },
    public_id: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: false,
  },
);
const productSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      trim: true,
      required: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
    },
    currency: {
      type: String,
      trim: true,
      uppercase: true,
      required: true,
    },
    size: {
      type: String,
      trim: true,
      required: true,
    },
    weight: {
      type: Number,
      trim: true,
      required: true,
    },
    material: {
      type: String,
      trim: true,
      required: true,
    },
    highlight_features: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },
    rating: {
      type: Number,
      trim: true,
      default: 0,
    },
    total_transactions: {
      type: Number,
      trim: true,
      default: 0,
    },
    short_description: {
      type: String,
      trim: true,
      required: true,
    },
    subcategory: {
      type: {
        subcategory_name: {
          type: String,
          trim: true,
          required: true,
        },
        subcategory_slug: {
          type: String,
          trim: true,
          required: true,
        },
        category_slug: {
          type: String,
          trim: true,
          required: true,
        },
      },
      required: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    status: {
      enum: ['pending', 'approved', 'inactive'],
      type: String,
      default: 'pending',
    },
    colors: [colorSchema],
    images: [imageSchema],
  },
  {
    timestamps: {
      currentTime: () => helpers.getTimeByTimezone(),
    },
  },
);
productSchema.pre('save', async function (next) {
  this.slug = helpers.generateSlugFrom(this.product_name);
  next();
});

const ProductModel = mongoose.model('product', productSchema, 'product');
module.exports = ProductModel;

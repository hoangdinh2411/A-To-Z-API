const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const helpers = require('../helpers');
const { categorySchema } = require('./category-model');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      require: true,
    },
    role: {
      ref: 'role',
      type: mongoose.Schema.Types.ObjectId,
    },
    company_name: {
      type: String,
      trim: true,
    },
    main_office: {
      type: String,
      trim: true,
    },
    office: {
      type: String,
      trim: true,
    },
    status: {
      enum: ['active', 'inactive'],
      type: String,
      default: 'active',
    },
    representative: {
      type: String,
      trim: true,
    },
    representative_phone: {
      type: String,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    tax_code: {
      type: String,
      trim: true,
    },
    director: {
      type: String,
      trim: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    category: {
      category_name: {
        type: String,
        trim: true,
      },
      category_slug: {
        type: String,
        trim: true,
      },
    },
    is_industrial_park: {
      type: Boolean,
      required: false,
    },

    avatar: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
    },
    token: {
      type: String,
      trim: true,
    },
    total_product: {
      type: Number,
    },
    total_transaction: {
      type: Number,
    },
    description: {
      type: String,
      trim: true,
    },
    policy: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: {
      currentTime: () => helpers.getTimeByTimezone(),
    },
  },
);

userSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.passwordEncryption = function (password) {
  return bcrypt.hashSync(password, 10);
};

const UserModel = mongoose.model('user', userSchema, 'user');
module.exports = UserModel;

const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    value: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: false,
  },
);

const PermissionModel = mongoose.model('permission', permissionSchema, 'permission');
module.exports = PermissionModel;

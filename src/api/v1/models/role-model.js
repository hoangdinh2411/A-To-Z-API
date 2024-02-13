const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    role_name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    permissions: [
      {
        ref: 'permission',
        type: mongoose.Schema.Types.ObjectId,
      },
    ],
  },
  {
    timestamps: false,
  },
);

const RoleModel = mongoose.model('role', roleSchema, 'role');
module.exports = RoleModel;

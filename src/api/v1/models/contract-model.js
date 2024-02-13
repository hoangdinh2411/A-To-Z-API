const mongoose = require('mongoose');
const helpers = require('../helpers');

const CONTRACT_STATUS_ENUM = {
  CONSULTING: 'CONSULTING',
  MAKE_AN_APPOINTMENT: 'MAKE_AN_APPOINTMENT',
  HAVE_MET: 'HAVE_MET',
  SIGNED: 'SIGNED',
  RUNNING_OUT: 'RUNNING_OUT',
  EXPIRED: 'EXPIRED',
};
const PAYMENT_METHODS_ENUM = {
  CASH: 'CASH',
  BANK_TRANSFER: 'BANK_TRANSFER',
};

const orderedProductsSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    product_name: {
      type: String,
      trim: true,
      required: true,
    },
    quantity: {
      type: Number,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: false,
  },
);

function isSigned() {
  return this.status === CONTRACT_STATUS_ENUM.SIGNED;
}

function payByBankTransfer() {
  return this.payment_method === PAYMENT_METHODS_ENUM.BANK_TRANSFER;
}

const contractSchema = new mongoose.Schema(
  {
    contract_number: {
      type: String,
      trim: true,
      required: isSigned(),
    },

    company: {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      company_name: {
        type: String,
        trim: true,
        required: true,
      },
    },
    total_value_of_contract: {
      type: Number,
      trim: true,
      required: isSigned(),
    },
    start_date: {
      type: String,
      trim: true,
      required: isSigned(),
    },
    end_date: {
      type: String,
      trim: true,
      required: isSigned(),
    },
    customer_name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
    },
    products: [orderedProductsSchema],
    status: {
      enum: CONTRACT_STATUS_ENUM,
      type: String,
      default: CONTRACT_STATUS_ENUM.CONSULTING,
    },
    address: {
      type: String,
      trim: true,
      required: isSigned(),
    },
    note: {
      type: String,
      trim: true,
    },
    shipping_fee: {
      type: Boolean,
    },
    shipping_to: {
      type: String,
      trim: true,
      required: function () {
        return this.shipping_fee;
      },
    },
    payment_method: {
      enum: PAYMENT_METHODS_ENUM,
      type: String,
      required: isSigned(),
    },
    bank_account_number: {
      type: String,
      trim: true,
      required: payByBankTransfer(),
    },
    bank_account_name: {
      type: String,
      trim: true,
      required: payByBankTransfer(),
    },
    signer_name: {
      type: String,
      trim: true,
      required: isSigned(),
    },
    signer_phone: {
      type: String,
      trim: true,
      required: isSigned(),
    },
  },
  {
    timestamps: {
      currentTime: () => helpers.getTimeByTimezone(),
    },
  },
);

const ContractsModel = mongoose.model('contracts', contractSchema, 'contracts');
module.exports = {
  ContractsModel,
  CONTRACT_STATUS_ENUM,
};

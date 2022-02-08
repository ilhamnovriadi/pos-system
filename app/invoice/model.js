const mongoose = require("mongoose");
const { model, Schema } = mongoose;

// Create Schema
const invoiceSchema = Schema(
  {
    payment_status: {
      type: String,
      enum: ["waiting_payment", "paid"],
      default: "waiting_payment",
    },
    delivery_fee: {
      type: Number,
      default: 0,
    },
    sub_total: {
      type: Number,
      required: [true, "Sub Total Harus Diisi"],
    },
    order_numbers: {
      type: Number,
    },
    delivery_address: {
      type: Schema.Types.ObjectId,
      ref: "deliveryAddress",
    },
    total: {
      type: Number,
      required: [true, "Total Harus Diisi"],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    order: {
      type: Schema.Types.ObjectId,
      ref: "order",
    },
  },
  { timestamps: true }
);

module.exports = model("invoice", invoiceSchema);

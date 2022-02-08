const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { model, Schema } = mongoose;
const Invoice = require("../invoice/model");
// Create Schema
const orderSchema = Schema(
  {
    status: {
      type: String,
      enum: ["waiting_payment", "processing", "in_delivery", "delivered"],
      default: "waiting_payment",
    },
    delivery_fee: {
      type: Number,
      default: 0,
    },
    order_numbers: {
      type: Number,
    },
    delivery_address: {
      type: Schema.Types.ObjectId,
      ref: "deliveryAddress",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    order_items: [
      {
        type: Schema.Types.ObjectId,
        ref: "orderItem",
      },
    ],
  },
  { timestamps: true }
);

orderSchema.plugin(AutoIncrement, { inc_field: "order_numbers" });
orderSchema.virtual("items_count").get(function () {
  return this.order_items.reduce(
    (total, item) => total + parseInt(item.qty),
    0
  );
});
orderSchema.post("save", async function () {
  let subTotal = this.order_items.reduce(
    (total, item) => total + parseInt(item.qty),
    0
  );
  let invoice = new Invoice({
    user: this.user,
    order: this._id,
    sub_total: subTotal,
    delivery_fee: parseInt(this.delivery_fee),
    total: parseInt(subTotal + this.delivery_fee),
    delivery_address: this.delivery_address,
  });
  await invoice.save();
});

module.exports = model("order", orderSchema);

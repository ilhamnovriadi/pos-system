const mongoose = require("mongoose");
const { model, Schema } = mongoose;

// Create Schema
const orderItemSchema = Schema({
  name: {
    type: String,
    minlength: [3, "Panjang Karater Minimal 3 Karakter"],
    required: [true, "Nama kategori Harus Diisi"],
  },
  qty: {
    type: Number,
    required: [true, "qty harus diisi"],
    min: [1, "Minimal qty adalah 1"],
  },
  price: {
    type: Number,
    required: [true, "Harga Harus Diisi"],
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "product",
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: "order",
  },
});

module.exports = model("orderItem", orderItemSchema);

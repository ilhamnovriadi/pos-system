const mongoose = require("mongoose");
const { model, Schema } = mongoose;

// Create Schema
const cartSchema = Schema({
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
    default: 0,
  },
  image_url: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: "product",
  },
});

module.exports = model("cart", cartSchema);

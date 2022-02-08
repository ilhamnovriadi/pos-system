const mongoose = require("mongoose");
const { model, Schema } = mongoose;

// Create Schema
const productSchema = Schema(
  {
    name: {
      type: String,
      minlength: [3, "Panjang Karater Minimal 3 Karakter"],
      required: [true, "Nama Harus Diisi"],
    },
    description: {
      type: String,
      maxlength: [1000, "Panjang Karater Maksimal 1000 Karakter"],
    },
    price: {
      type: Number,
      default: 0,
    },
    image_url: String,
    category: {
      type: Schema.Types.ObjectId,
      ref: "categories",
    },
    tags: {
      type: [Schema.Types.ObjectId],
      ref: "tags",
    },
  },
  { timestamps: true }
);

module.exports = model("product", productSchema);

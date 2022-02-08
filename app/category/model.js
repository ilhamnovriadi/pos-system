const mongoose = require("mongoose");
const { model, Schema } = mongoose;

// Create Schema
const categoriesSchema = Schema({
  name: {
    type: String,
    minlength: [3, "Panjang Karater Minimal 3 Karakter"],
    maxlength: [30, "Panjang Karater Maksimal 30 Karakter"],
    required: [true, "Nama kategori Harus Diisi"],
  },
});

module.exports = model("categories", categoriesSchema);

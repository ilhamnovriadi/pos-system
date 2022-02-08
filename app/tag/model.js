const mongoose = require("mongoose");
const { model, Schema } = mongoose;

// Create Schema
const tagSchema = Schema({
  name: {
    type: String,
    minlength: [3, "Panjang Karater Minimal 3 Karakter"],
    maxlength: [30, "Panjang Karater Maksimal 30 Karakter"],
    required: [true, "Nama tags Harus Diisi"],
  },
});

module.exports = model("tags", tagSchema);

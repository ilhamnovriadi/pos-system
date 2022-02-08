const mongoose = require("mongoose");
const { model, Schema } = mongoose;

// Create Schema
const deliveryAddressSchema = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    nama_penerima: {
      type: String,
      minlength: [3, "Panjang Karater Minimal 3 Karakter"],
      maxlength: [30, "Panjang Karater Maksimal 30 Karakter"],
      required: [true, "Nama Penerima Harus Diisi"],
    },
    nomor_handphone: {
      type: Number,
      required: [true, "Nomor Handphone Harus Diisi"],
    },
    label_alamat: {
      type: String,
      minlength: [3, "Panjang Karater Minimal 3 Karakter"],
      maxlength: [30, "Panjang Karater Maksimal 30 Karakter"],
      default: "Rumah",
    },
    kota_kecamatan: {
      type: String,
      minlength: [3, "Panjang Karater Minimal 3 Karakter"],
      maxlength: [255, "Panjang Karater Maksimal 255 Karakter"],
      required: [true, "Kota Kecamatan Harus Diisi"],
    },
    alamat_lengkap: {
      type: String,
      minlength: [3, "Panjang Karater Minimal 3 Karakter"],
      maxlength: [255, "Panjang Karater Maksimal 255 Karakter"],
      required: [true, "Alamat Lengkap Harus Diisi"],
    },
  },
  { timestamps: true }
);

module.exports = model("deliveryAddress", deliveryAddressSchema);

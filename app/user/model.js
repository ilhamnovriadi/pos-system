const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);
const { model, Schema } = mongoose;
const bcrypt = require("bcrypt");
// Create Schema
const userSchema = Schema(
  {
    fullname: {
      type: String,
      minlength: [3, "Panjang Karater Minimal 3 Karakter"],
      maxlength: [255, "Panjang Karater Maksimal 255 Karakter"],
      required: [true, "Nama Harus Diisi"],
    },
    customer_id: {
      type: Number,
    },
    email: {
      type: String,
      maxlength: [255, "Panjang Karater Maksimal 255 Karakter"],
      required: [true, "Email Harus Diisi"],
    },
    password: {
      type: String,
      maxlength: [255, "Panjang Karater Maksimal 255 Karakter"],
      required: [true, "Email Harus Diisi"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    token: [String],
  },
  { timestamps: true }
);

userSchema.path("email").validate(
  function (email) {
    var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
  },
  (attr) => `${attr.value} harus merupakan email yang valid!`
);

userSchema.path("email").validate(
  async function (value) {
    try {
      const count = await this.model("user").count({ email: value });
      return !count;
    } catch (err) {
      throw err;
    }
  },
  (attr) => `${attr.value} sudah terdaftar!`
);

const HASH_ROUND = 10;
userSchema.pre("save", async function (next) {
  this.password = bcrypt.hashSync(this.password, HASH_ROUND);
  next();
});

userSchema.plugin(AutoIncrement, { inc_field: "customer_id" });

module.exports = model("user", userSchema);

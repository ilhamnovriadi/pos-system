const User = require("../user/model");
const bcrypt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config");
const { getToken } = require("../../utils");

const register = async (req, res, next) => {
  try {
    const payload = req.body;
    const newUser = new User(payload);
    await newUser.save();
    return res.json(newUser);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.status(404).json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    next(err);
  }
};

const index = async (req, res, next) => {
  try {
    const user = await User.find().select(
      "_id fullname email customer_id role"
    );
    return res.json(user);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.status(404).json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }

    next(err);
  }
};

const localStrategy = async (email, password, done) => {
  try {
    let user = await User.findOne({ email }).select(
      "-__v -createdAt -updatedAt -token"
    );
    if (!user) return done();
    if (bcrypt.compareSync(password, user.password)) {
      ({ user, ...userWithoutPassword } = user.toJSON());
      return done(null, userWithoutPassword);
    }
  } catch (err) {
    done(err, null);
  }
  done();
};

const login = async (req, res, next) => {
  passport.authenticate("local", async function (err, user) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res
        .status(404)
        .json({ error: 1, message: "Email atau Password Salah" });
    }

    delete user.password;
    let signed = jwt.sign(user, config.secretKey);
    await User.findByIdAndUpdate(user._id, { $push: { token: signed } });
    res.json({
      message: "Login Berhasil",
      user,
      token: signed,
    });
  })(req, res, next);
};

const logout = async (req, res, next) => {
  try {
    let token = getToken(req);
    let user = await User.findOneAndUpdate(
      { token: { $in: token } },
      { $pull: { token: token } },
      { useFindAndModify: false }
    );

    if (!token || !user) {
      res.status(404).json({
        error: 1,
        message: "User not found!",
      });
    }

    return res.json({
      error: 0,
      message: "Logout Berhasil",
    });
  } catch (error) {
    console.log(error.message);
  }
};

const me = async (req, res, next) => {
  if (!req.user) {
    res.status(404).json({
      error: 1,
      message: "You're not login or token expired",
    });
  }

  res.json(req.user);
};

module.exports = { register, index, login, localStrategy, logout, me };

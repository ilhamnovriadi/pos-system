const { getToken, policyFor } = require("../utils");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../app/config");
const User = require("../app/user/model");

const decodeToken = () => {
  return async function (req, res, next) {
    try {
      const token = getToken(req);
      if (!token) return next();
      req.user = jwt.verify(token, secretKey);
      const user = await User.findOne({ token: { $in: [token] } });
      if (!user) {
        return res.json({ error: 1, message: "Token Expired" });
      }
    } catch (err) {
      if (err && err.name === "JsonWebTokenError") {
        return res.json({ error: 1, message: err.message });
      }
      next(err);
    }
    return next();
  };
};

const police_check = (action, subject) => {
  return function (req, res, next) {
    let policy = policyFor(req.user);
    if (!policy.can(action, subject)) {
      return res.json({
        error: 1,
        message: `You're not allowed to ${action} ${subject}`,
      });
    }
    next();
  };
};

module.exports = { decodeToken, police_check };

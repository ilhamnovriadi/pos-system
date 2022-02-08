const { Ability, AbilityBuilder } = require("@casl/ability");

const getToken = (req) => {
  let token = req.headers.authorization
    ? req.headers.authorization.replace("Bearer ", "")
    : null;
  return token && token.length ? token : null;
};

const policies = {
  guest(user, { can }) {
    can("view", "product");
    can("read", "product");
  },
  user(user, { can }) {
    can("view", "order");
    can("create", "order");
    can("read", "order", { user: user._id });
    can("update", "user", { _id: user._id });
    can("read", "cart", { user: user._id });
    can("update", "cart", { _id: user._id });
    can("view", "deliveryAddress");
    can("create", "deliveryAddress", { user: user._id });
    can("update", "deliveryAddress", { _id: user._id });
    can("read", "invoice", { user: user._id });
  },
  admin(user, { can }) {
    can("manage", "all");
  },
};

const policyFor = (user) => {
  let builder = new AbilityBuilder();
  if (user && typeof policies[user.role] === "function") {
    policies[user.role](user, builder);
  } else {
    policies["guest"](user, builder);
  }
  return new Ability(builder.rules);
};

module.exports = { getToken, policyFor };

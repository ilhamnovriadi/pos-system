const { Ability, AbilityBuilder } = require("@casl/ability");

const getToken = (req) => {
  let token = req.headers.authorization
    ? req.headers.authorization.replace("Bearer ", "")
    : null;
  return token && token.length ? token : null;
};

const policies = {
  guest(user, { can }) {},
  user(user, { can }) {},
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

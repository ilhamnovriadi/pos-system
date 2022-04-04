const Tags = require("./model");

const viewTags = (params) => {
  return new Promise(async (resolve, reject) => {
    let tags = await Tags.findOne({
      name: { $regex: params, $options: "i" },
    });
    if (tags) {
      resolve(tags);
    } else {
      reject("error from view category");
    }
  });
};

module.exports = {
  viewTags,
};

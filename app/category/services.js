const Category = require("./model");

const viewCategory = (params) => {
  return new Promise(async (resolve, reject) => {
    let category = await Category.findOne({
      name: { $regex: params, $options: "i" },
    });
    if (category) {
      resolve(category);
    } else {
      reject("error from view category");
    }
  });
};

module.exports = {
  viewCategory,
};

const Product = require("./model");

const findProductbyIds = (productIds) => {
  return new Promise(async (resolve, reject) => {
    const products = await Product.find({ _id: { $in: productIds } }).lean();
    if (products) {
      resolve(products);
    } else {
      reject("error from find product");
    }
  });
};

module.exports = {
  findProductbyIds,
};

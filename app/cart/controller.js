const { resetCart, deployCart, indexCart } = require("../cart-item/services");
const { findProductbyIds } = require("../product/services");

const update = async (req, res, next) => {
  try {
    const { items } = req.body;
    const productIds = items.map((item) => item.product);
    const products = await findProductbyIds(productIds);
    let cartItems = items.map((item) => {
      let relateProduct = products.find(
        (product) => product._id.toString() === item.product
      );
      return {
        product: relateProduct._id,
        price: relateProduct.price,
        image_url: relateProduct.image_url,
        name: relateProduct.name,
        user: req.user._id,
        qty: item.qty,
      };
    });

    await resetCart(req.user._id);
    await deployCart(cartItems, req.user._id);

    let cartsResponse = items.map((item) => {
      let relateProduct = products.find(
        (product) => product._id.toString() === item.product
      );
      return {
        ...relateProduct,
        qty: item.qty,
      };
    });
    return res.json(cartsResponse);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
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
    let items = await indexCart(req.user._id);
    return res.json(items);
  } catch (err) {
    if (err && err.name === "ValidationError") {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors,
      });
    }
    next(err);
  }
};

module.exports = { update, index };

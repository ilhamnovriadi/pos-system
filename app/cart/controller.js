const Cart = require("../cart-item/model");
const Product = require("../product/model");

const update = async (req, res, next) => {
  try {
    const { items } = req.body;
    const productIds = items.map((item) => item.product);
    const products = await Product.find({ _id: { $in: productIds } }).lean();
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

    await Cart.deleteMany({ user: req.user._id });
    await Cart.bulkWrite(
      cartItems.map((item) => {
        console.log(item.qty)
        return {
          updateOne: {
            filter: {
              user: req.user._id,
              product: item.product,
            },
            update: item,
            upsert: true,
          },
        };
      })
    );

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
    let items = await Cart.find({ user: req.user._id }).populate("product");
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

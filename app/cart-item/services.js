const Cart = require("./model");

const indexCart = (id) => {
  return new Promise(async (resolve, reject) => {
    const cart = await Cart.find({ user: id }).populate("product");
    if (cart) {
      resolve(cart);
    } else {
      reject("error from find product");
    }
  });
};

const resetCart = (id) => {
  return new Promise(async (resolve, reject) => {
    const cart = await Cart.deleteMany({ user: id });
    if (cart) {
      resolve(cart);
    } else {
      reject("error from find product");
    }
  });
};

const deployCart = (payload, id) => {
  return new Promise(async (resolve, reject) => {
    const cart = await Cart.bulkWrite(
      payload.map((item) => {
        return {
          updateOne: {
            filter: {
              user: id,
              product: item.product,
            },
            update: item,
            upsert: true,
          },
        };
      })
    );
    if (cart) {
      resolve(cart);
    } else {
      reject("error from find product");
    }
  });
};

module.exports = {
  resetCart,
  deployCart,
  indexCart,
};

const Order = require("./model");

const viewOrder = (id) => {
  return new Promise(async (resolve, reject) => {
    let order = await Order.findOne({ order_numbers: id })
      .populate("order_items")
      .populate("delivery_address")
      .lean();
    if (order) {
      resolve(order);
    } else {
      reject("error from find order");
    }
  });
};

module.exports = {
  viewOrder,
};

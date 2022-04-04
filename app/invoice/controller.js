const Invoice = require("./model");
const { viewOrder } = require("../order/services");

const show = async (req, res, next) => {
  try {
    let { id } = req.params;
    let order = await viewOrder(id);
    let invoice = await Invoice.findOne({ order: order._id })
      .populate("order")
      .populate({ path: "user", select: "-password -token -role" })
      .lean();

    return res.json({
      ...invoice,
      order_items: order.order_items,
      address: order.delivery_address,
    });
  } catch (err) {
    return res.json({
      error: 1,
      message: "Error when get invoice",
    });
  }
};

module.exports = { show };

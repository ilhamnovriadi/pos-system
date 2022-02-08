const Invoice = require("./model");
const Order = require("../order/model");
const { Types } = require("mongoose");
const { policyFor } = require("../../utils");
const { subject } = require("@casl/ability");

const show = async (req, res, next) => {
  try {
    let { id } = req.params;
    let order = await Order.findOne({ order_numbers: id })
      .populate("order_items")
      .populate("delivery_address");
    let invoice = await Invoice.findOne({ order: order._id })
      .populate("order")
      .populate({ path: "user", select: "-password -token -role" })
      .lean();

    let policy = policyFor(req.user);
    let subjectPolicy = subject("invoice", {
      ...invoice,
      user: invoice.user._id,
    });

    if (!policy.can("read", subjectPolicy)) {
      return res.json({
        error: 1,
        message: "Anda tidak memiliki akses untuk mengakses invoice ini",
      });
    }

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

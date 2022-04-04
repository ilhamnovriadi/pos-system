const Invoice = require("./model");
const { policyFor } = require("../../utils");
const { subject } = require("@casl/ability");
const { viewOrder } = require("../order/services");

const show = async (req, res, next) => {
  try {
    let { id } = req.params;
    let order = await viewOrder(id);
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

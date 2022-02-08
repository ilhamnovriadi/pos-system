const Cart = require("../cart-item/model");
const Order = require("../order/model");
const OrderItem = require("../order-item/model");
const DeliveryAddress = require("../deliveryAddress/model");
const { Types } = require("mongoose");

const store = async (req, res, next) => {
  try {
    let { delivery_address, delivery_fee } = req.body;
    let items = await Cart.find({ user: req.user._id }).populate("product");
    if (!items) {
      return res.json({
        error: 1,
        message: "You're not create order because you have not items in cart",
      });
    }
    let address = await DeliveryAddress.findOne({ _id: delivery_address });
    console.log(address)
    let order = new Order({
      _id: new Types.ObjectId(),
      status: "waiting_payment",
      delivery_address: address._id,
      delivery_fee: delivery_fee,
      user: req.user._id,
    });
    let orderItems = await OrderItem.insertMany(
      items.map((item) => ({
        ...item,
        name: item.product.name,
        qty: parseInt(item.qty),
        price: parseInt(item.product.price),
        order: order._id,
        product: item.product._id,
      }))
    );
    orderItems.forEach((item) => order.order_items.push(item));
    await order.save();
    await Cart.deleteMany({ user: req.user._id });
    // const result = await Order.findOne({ _id: order._id.toString() });
    // console.log(order);
    // console.log(result);
    return res.json(order);
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
  const { skip = 0, limit = 0 } = req.query;

  try {
    let count = await Order.find({ user: req.user._id }).countDocuments();
    let orders = await Order.find({ user: req.user._id })
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate("order_items")
      .sort("-createdAt");
    return res.json({
      data: orders.map((order) => order.toJSON({ virtuals: true })),
      count,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { store, index };

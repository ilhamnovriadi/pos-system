const DeliveryAddress = require("./model");

const store = async (req, res, next) => {
  const payload = req.body;
  try {
    let deliveryAddress = new DeliveryAddress({
      ...payload,
      user: req.user._id,
    });
    await deliveryAddress.save();
    return res.json(deliveryAddress);
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
    let deliveryAddress = await DeliveryAddress.find();
    return res.json(deliveryAddress);
  } catch (err) {
    next(err);
  }
};

const indexToUser = async (req, res, next) => {
  try {
    let deliveryAddress = await DeliveryAddress.find({ user: req.user._id });
    return res.json(deliveryAddress);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    let payload = req.body;
    const { id } = req.params;
    const deliveryAddress = await DeliveryAddress.findByIdAndUpdate(
      id,
      payload,
      {
        new: true,
        runValidators: true,
      }
    );
    return res.json(deliveryAddress);
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

const destroy = async (req, res, next) => {
  try {
    const { id } = req.params;
    let deliveryAddress = await DeliveryAddress.findByIdAndDelete(id);
    return res.json(deliveryAddress);
  } catch (err) {
    next(err);
  }
};

module.exports = { store, index, update, destroy, indexToUser };

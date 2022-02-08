const Categories = require("./model");

const store = async (req, res, next) => {
  const payload = req.body;
  try {
    let categories = new Categories(payload);
    await categories.save();
    return res.json(categories);
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
    let categories = await Categories.find();
    return res.json(categories);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    let payload = req.body;
    const { id } = req.params;
    const categories = await Categories.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    return res.json(categories);
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
    let categories = await Categories.findByIdAndDelete(id);
    return res.json(categories);
  } catch (err) {
    next(err);
  }
};

module.exports = { store, index, update, destroy };

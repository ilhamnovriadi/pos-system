const Tags = require("./model");

const store = async (req, res, next) => {
  const payload = req.body;
  try {
    let tags = new Tags(payload);
    await tags.save();
    return res.json(tags);
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
    let tags = await Tags.find();
    return res.json(tags);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    let payload = req.body;
    const { id } = req.params;
    const tags = await Tags.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    return res.json(tags);
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
    let tags = await Tags.findByIdAndDelete(id);
    return res.json(tags);
  } catch (err) {
    next(err);
  }
};

module.exports = { store, index, update, destroy };

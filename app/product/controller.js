const path = require("path");
const fs = require("fs");
const config = require("../config");
const Product = require("./model");
const { viewCategory } = require("../category/services");
const { viewTags } = require("../tag/services");

const handleTempFile = (file) => {
  let tmp_path = file.path;
  let originalExt =
    file.originalname.split(".")[file.originalname.split(".").length - 1];
  let filename = file.filename + "." + originalExt;
  let target_path = path.resolve(
    config.rootPath,
    `public/images/products/${filename}`
  );

  const src = fs.createReadStream(tmp_path);
  const dest = fs.createWriteStream(target_path);

  return { src, dest };
};

const store = async (req, res, next) => {
  try {
    let payload = req.body;

    if (payload.category) {
      let category = await viewCategory(payload.category);
      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.tags.length > 0) {
      let concul = [];
      let tags = payload.tags.replace(/\s+/g, "").split(",");

      for (let i = 0; i < tags.length; i++) {
        const element = tags[i];
        const listTags = await viewTags(element);
        if (listTags) concul.push(listTags);
      }

      if (concul.length) {
        payload = { ...payload, tags: concul.map((tag) => tag._id) };
      } else {
        delete payload.tags;
      }
    }

    if (req.file) {
      let { src, dest } = handleTempFile(req.file);
      src.pipe(dest);

      src.on("end", async () => {
        try {
          let product = new Product({ ...payload, image_url: filename });
          await product.save();
          return res.json(product);
        } catch (err) {
          fs.unlinkSync(target_path);
          if (err && err.name === "ValidationError") {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors,
            });
          }
          next(err);
        }

        src.on("error", async () => {
          next(err);
        });
      });
    } else {
      let product = new Product(payload);
      await product.save();
      return res.json(product);
    }
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
  const { skip = 0, limit = 0, q = "", category = "", tags = "" } = req.query;

  let criteria = {};
  if (q.length) {
    criteria = { ...criteria, name: { $regex: q, $options: "i" } };
  }

  if (category.length) {
    let categoriesResult = await viewCategory(category);
    if (categoriesResult) {
      criteria = { ...criteria, category: categoriesResult._id };
    }
  }

  if (tags.length) {
    let concul = [];
    let tagsResult = tags.replace(/\s+/g, "").split(",");

    for (let i = 0; i < tagsResult.length; i++) {
      const element = tagsResult[i];

      const listTags = await viewTags(element);
      if (listTags) concul.push(listTags);
    }

    if (concul.length > 0) {
      criteria = { ...criteria, tags: { $in: concul.map((tag) => tag._id) } };
    }
  }

  try {
    let count = await Product.find(criteria).countDocuments();
    let product = await Product.find(criteria)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate("category")
      .populate("tags");
    return res.json({ data: product, count });
  } catch (err) {
    next(err);
  }
};

const details = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product = await Product.findOne({ _id: id })
      .populate("category")
      .populate("tags");
    return res.json(product);
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    let payload = req.body;
    const { id } = req.params;
    if (payload.category) {
      let category = await viewCategory(payload.category);
      if (category) {
        payload = { ...payload, category: category._id };
      } else {
        delete payload.category;
      }
    }

    if (payload.tags && payload.tags.length > 0) {
      let concul = [];
      let tags = payload.tags.replace(/\s+/g, "").split(",");

      for (let i = 0; i < tags.length; i++) {
        const element = tags[i];

        const listTags = await viewTags(element);
        if (listTags) concul.push(listTags);
      }

      if (concul.length) {
        delete payload.tags;
        payload = { ...payload, tags: concul.map((tag) => tag._id) };
      } else {
        delete payload.tags;
      }
    }

    if (req.file) {
      let { src, dest } = handleTempFile(req.file);
      src.pipe(dest);

      src.on("end", async () => {
        try {
          let product = await Product.findById(id);
          let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;
          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          }

          product = await Product.findByIdAndUpdate(
            id,
            { ...payload, image_url: filename },
            {
              new: true,
              runValidators: true,
            }
          );
          return res.json(product);
        } catch (err) {
          fs.unlinkSync(target_path);
          if (err && err.name === "ValidationError") {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors,
            });
          }
          next(err);
        }

        src.on("error", async () => {
          next(err);
        });
      });
    } else {
      let product = await Product.findById(id);
      product = await Product.findByIdAndUpdate(
        id,
        { ...payload, image_url: product.image_url },
        {
          new: true,
          runValidators: true,
        }
      );
      return res.json(product);
    }
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
    let product = await Product.findByIdAndDelete(id);
    let currentImage = `${config.rootPath}/public/images/products/${product.image_url}`;
    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }
    return res.json(product);
  } catch (err) {
    next(err);
  }
};

module.exports = { store, index, update, destroy, details };

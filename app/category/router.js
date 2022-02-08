const router = require("express").Router();

const categoriesController = require("./controller");

router.post("/categories", categoriesController.store);
router.put("/categories/:id", categoriesController.update);
router.get("/categories", categoriesController.index);
router.delete("/categories/:id", categoriesController.destroy);

module.exports = router;

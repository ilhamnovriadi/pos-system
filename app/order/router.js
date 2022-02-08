const router = require("express").Router();

const orderController = require("./controller");

router.post("/orders", orderController.store);
router.get("/orders", orderController.index);

module.exports = router;

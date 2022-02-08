const router = require("express").Router();

const cartController = require("./controller");

router.put("/cart", cartController.update);
router.get("/cart", cartController.index);

module.exports = router;

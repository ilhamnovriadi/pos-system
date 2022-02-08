const router = require("express").Router();

const { police_check } = require("../../middlewares");
const deliveryAddressController = require("./controller");

router.post("/delivery-address", deliveryAddressController.store);
router.put("/delivery-address/:id", deliveryAddressController.update);
router.get("/delivery-address", deliveryAddressController.index);
router.get("/user-delivery-address", deliveryAddressController.indexToUser);
router.delete("/delivery-address/:id", deliveryAddressController.destroy);

module.exports = router;

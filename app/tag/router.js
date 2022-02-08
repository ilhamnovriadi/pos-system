const router = require("express").Router();

const tagsController = require("./controller");

router.post("/tags", tagsController.store);
router.put("/tags/:id", tagsController.update);
router.get("/tags", tagsController.index);
router.delete("/tags/:id", tagsController.destroy);

module.exports = router;

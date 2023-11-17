const express = require("express");
const publicationController = require("../../controller/System/publicationController");
const router = express.Router();

router.post("/create", publicationController.create);
// router.put("/update", systemAuthController.update);
// router.delete("/delete", systemAuthController.delete);
// router.post("/get", systemAuthController.get);
// router.get("/getone", systemAuthController.getone);

module.exports = router;

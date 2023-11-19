const express = require("express");
const userController = require("../../controller/System/userController");
const router = express.Router();

router.post("/create", userController.create);
router.put("/update/:id", userControllerController.update);
router.delete("/delete/:id", userControllerController.deleteRecord);
router.post("/get", userControllerController.get);
router.get("/get/:id", userController.getone);

module.exports = router;
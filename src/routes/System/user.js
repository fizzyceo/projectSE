const express = require("express");
const userController = require("../../controller/System/userControlleur");
const router = express.Router();

router.post("/create", userController.create);
router.put("/update/:id", userController.update);
router.delete("/delete/:id", userController.deleteRecord);
router.get("/get", userController.get);
router.get("/get/:id", userController.getone);
router.post("/login", userController.login);

module.exports = router;
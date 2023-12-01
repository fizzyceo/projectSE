const express = require("express");
const messageControlleur = require("../../controller/System/messageControlleur");
const { verifyToken } = require("../../middlewares/verifyToken");
const router = express.Router();

router.post("/create", verifyToken, messageControlleur.create);
router.put("/update/:id", verifyToken, messageControlleur.update);
router.delete("/delete/:id", verifyToken, messageControlleur.deleteRecord);
router.post("/get", verifyToken, messageControlleur.get);
router.get("/get/:id", verifyToken, messageControlleur.getone);

module.exports = router;

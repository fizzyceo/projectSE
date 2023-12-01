const express = require("express");
const conversationControlleur = require("../../controller/System/conversationControlleur");
const { verifyToken } = require("../../middlewares/verifyToken");
const router = express.Router();

router.post("/create", verifyToken, conversationControlleur.create);
router.put("/update/:id", verifyToken, conversationControlleur.update);
router.delete("/delete/:id", verifyToken, conversationControlleur.deleteRecord);
router.post("/get", verifyToken, conversationControlleur.get);
router.get("/get/:id", verifyToken, conversationControlleur.getone);

module.exports = router;

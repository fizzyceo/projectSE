const express = require("express");
const conversationControlleur = require("../../controller/System/conversationControlleur");
const router = express.Router();

router.post("/create", conversationControlleur.create);
router.put("/update/:id", conversationControlleur.update);
router.delete("/delete/:id", conversationControlleur.deleteRecord);
router.post("/get", conversationControlleur.get);
router.get("/get/:id", conversationControlleur.getone);

module.exports = router;

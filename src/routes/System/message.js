const express = require("express");
const messageControlleur = require("../../controller/System/messageControlleur");
const router = express.Router();

router.post("/create", messageControlleur.create);
router.put("/update/:id", messageControlleur.update);
router.delete("/delete/:id", messageControlleur.deleteRecord);
router.get("/get", messageControlleur.get);
router.get("/get/:id", messageControlleur.getone);

module.exports = router;

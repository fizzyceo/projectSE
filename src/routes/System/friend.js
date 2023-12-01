const express = require("express");
const FriendControlleur = require("../../controller/System/friendControlleur");
const router = express.Router();

router.post("/create", FriendControlleur.create);
//router.put("/update/:id", FriendControlleur.update);
router.delete("/delete/:id", FriendControlleur.deleteRecord);
router.get("/get", FriendControlleur.get);
router.get("/get/:id", FriendControlleur.getone);

module.exports = router;
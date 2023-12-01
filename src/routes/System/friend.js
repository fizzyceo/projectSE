const express = require("express");
const FriendControlleur = require("../../controller/System/friendControlleur");
const { verifyToken } = require("../../middlewares/verifyToken");
const router = express.Router();

router.post("/create", verifyToken, FriendControlleur.create);
//router.put("/update/:id", FriendControlleur.update);
router.delete("/delete/:id", verifyToken, FriendControlleur.deleteRecord);
router.post("/get", verifyToken, FriendControlleur.get);
router.get("/get/:id", verifyToken, FriendControlleur.getone);

module.exports = router;

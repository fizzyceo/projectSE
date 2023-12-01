const express = require("express");
const GroupeControlleur = require("../../controller/System/groupeControlleur");
const { verifyToken } = require("../../middlewares/verifyToken");
const router = express.Router();

router.post("/create", verifyToken, GroupeControlleur.create);
router.put("/update/:id", verifyToken, GroupeControlleur.update);
router.delete("/delete/:id", verifyToken, GroupeControlleur.deleteRecord);
router.post("/get", verifyToken, GroupeControlleur.get);
router.get("/get/:id", GroupeControlleur.getone);

module.exports = router;

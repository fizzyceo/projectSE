const express = require("express");
const GroupeControlleur = require("../../controller/System/groupeControlleur");
const router = express.Router();

router.post("/create", GroupeControlleur.create);
router.put("/update/:id", GroupeControlleur.update);
router.delete("/delete/:id", GroupeControlleur.deleteRecord);
router.get("/get", GroupeControlleur.get);
router.get("/get/:id", GroupeControlleur.getone);

module.exports = router;
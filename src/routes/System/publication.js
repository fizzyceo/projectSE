const express = require("express");
const publicationController = require("../../controller/System/publicationController");
const router = express.Router();

router.post("/create", publicationController.create);
router.put("/update/:id", publicationController.update);
router.delete("/delete/:id", publicationController.deleteRecord);
router.get("/get", publicationController.get);
router.get("/get/:id", publicationController.getone);

module.exports = router;

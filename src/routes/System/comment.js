const express = require("express");
const commentController = require("../../controller/System/commentControlleur");
const router = express.Router();

router.post("/create", commentController.create);
router.put("/update/:id", commentController.update);
router.delete("/delete/:id", commentController.deleteRecord);
router.get("/get", commentController.get);
router.get("/get/:id", commentController.getone);


module.exports = router;
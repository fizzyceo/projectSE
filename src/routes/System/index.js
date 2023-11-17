const publication = require("./publication");
const conversation = require("./conversation");
const message = require("./message");
const express = require("express");

const router = express.Router();

router.use("/publication", publication);
router.use("/message", message);
router.use("/conversation", conversation);

module.exports = router;

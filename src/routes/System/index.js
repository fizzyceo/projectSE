const publication = require("./publication");
const conversation = require("./conversation");
const message = require("./message");
const user= require("./user");
const express = require("express");

const router = express.Router();

router.use("/publication", publication);
router.use("/message", message);
router.use("/conversation", conversation);
router.use("/user", user);


module.exports = router;

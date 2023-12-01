const publication = require("./publication");
const conversation = require("./conversation");
const message = require("./message");
const user= require("./user");
const friend= require("./friend");
const groupe= require("./groupe");
const Comment= require("./comment");

const express = require("express");

const router = express.Router();

router.use("/publication", publication);
router.use("/message", message);
router.use("/conversation", conversation);
router.use("/user", user);
router.use("/friend", friend);
router.use("/groupe", groupe);
router.use("/comment", Comment);
module.exports = router;

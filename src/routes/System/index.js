const publication = require("./publication");
const express = require("express");

const router = express.Router();

router.use("/publication", publication);

module.exports = router;

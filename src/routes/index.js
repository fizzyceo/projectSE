const express = require("express");
const router = express.Router();
const authRoutes = require("./auth");
const uploadImageRoutes = require("./uploadImage");

router.use("/auth", authRoutes);
router.use("/image", uploadImageRoutes);
//pppkvhhdjvj
router.use("/health", (req, res, next) => {
  res.status(200);
  res.end();
});

router.get("/", (req, res, next) => {
  try {
    res.send(Math.random().toString());
  } catch (error) {
    next(error);
  }
});

module.exports = router;

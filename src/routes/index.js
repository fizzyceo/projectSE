const express = require("express");
const router = express.Router();
const authRoutes = require("./auth");
const systemManagementRoutes = require("./systemManagement");
const uploadImageRoutes = require("./uploadImage");

router.use("/auth", authRoutes);
router.use("/system", systemManagementRoutes);
router.use("/image", uploadImageRoutes);

router.use("/health", (req, res, next) => {
  res.status(200);
  res.end();
})

router.get("/", (req, res, next) => {
  try {
    res.send(Math.random().toString());
  } catch (error) {
    next(error);
  }
});

module.exports = router;

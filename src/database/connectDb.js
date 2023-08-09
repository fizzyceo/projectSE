const mongoose = require("mongoose");
const { logger } = require("../Logger");
const { updateCode } = require("../helpers/updateCode");

const connectDb = (url, server) => {
  mongoose
    .connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // auth: {
      //   username: 'admin',
      //   password: 'password'
      // }
    })
    .then(async () => {
      logger.info("Database connected");

    })
    .then(()=>{
      server();
    })
    .catch((error) => {
      logger.error("database connection error");
      logger.error(error.message);
    });
};

module.exports = connectDb;

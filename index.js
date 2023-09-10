const dotenv = require("dotenv");
const { logger } = require("./src/Logger");
const connectDb = require("./src/database/connectDb");
dotenv.config();
const server = require("./src/app");
//============================================================
const myServer = () => {
  server.listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.PORT}`);
  });
};
console.log(process.env.MONGO_URL);
connectDb(process.env.MONGO_URL, myServer);
require('./src/mqtt')



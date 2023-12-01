const dotenv = require("dotenv");
const connectDb = require("./src/database/connectDb");

dotenv.config();

const server = require("./src/app");
const { default: axios } = require("axios");

//============================================================

const myServer = () => {
  server.listen(process.env.PORT, () => {
    console.info(`Server is running on port ${process.env.PORT}`);
  });
};

console.log(process.env.MONGO_URL);

myServer();
// require("./src/mqtt");
// setInterval(() => {
//   console.log("Hi from calculating danger function");
// }, TIME_TO_CALL_WEATHER_API);

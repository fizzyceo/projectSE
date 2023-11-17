const express = require("express");
const cors = require("cors");
const correlation = require("express-correlation-id");

const router = require("./routes");
const apiErrorHandler = require("./error/api-error-handler");
const { apiLimiter } = require("./middlewares/rateLimiter");
const morgan = require("morgan");
const app = express();
const server = require("http").createServer(app);

//===== Middlewares ==========================================
app.use(apiLimiter);
app.set("trust proxy", 1);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(correlation());

app.use(
  morgan("tiny", {
    skip: (req) =>
      req.method === "OPTIONS" ||
      req.url === "/health" ||
      req.baseUrl === "/health",
    stream: {
      write: (message) => {
        console.info(message.substring(0, message.lastIndexOf("\n")));
      },
    },
  })
);
//===== static files ==========================================

app.use(express.static("public"));

//===== Routes ==========================================
app.use("/", router);

//not found handler
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
//===== Error Handler ===================================
app.use(apiErrorHandler);

process.on("uncaughtException", (e) => {
  console.error(JSON.stringify(e));
  console.log("uncaughtException : ", e);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  console.log("unhandledRejection : ", promise, "reason:", reason);
});

module.exports = server;

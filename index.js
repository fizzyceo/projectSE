const dotenv = require("dotenv");
const connectDb = require("./src/database/connectDb");

dotenv.config();

const server = require("./src/app");
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

//============================================================
// Handle Socket.IO events
io.on("connection", (socket) => {
  console.log("New socket connection:", socket.id);
  // Handle 'new_message' event
  socket.on("new_message", (message) => {
    console.log("on new message *************************");
    console.log("Received new message:", message);
    // Process the received message and emit it back or perform other actions
    io.emit("new_message", message); // Broadcast the message to all connected clients
  });

  // Other event listeners or socket logic can be added here
});

const myServer = () => {
  server.listen(process.env.PORT, () => {
    console.info(`Server is running on port ${process.env.PORT}`);
  });
};

myServer();

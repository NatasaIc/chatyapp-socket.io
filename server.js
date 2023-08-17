const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const port = 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log(`A new user connected: ${socket.id}`);
  socket.emit("message", "Welcome to the chat");
});

server.listen(port, () => console.log(`Listening on port: ${port}`));

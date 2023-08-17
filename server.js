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

  socket.on("user_connected", (username) => {
    socket.broadcast.emit("user_information_to_other_in_room", username); 
    socket.emit("message_to_new_user", username);
  });

  socket.on("join_room", (room) => {
    socket.join(room);
  });

  socket.on("leave_room", (room) => {
    socket.leave(room);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
  });
});

server.listen(port, () => console.log(`Listening on port: ${port}`));

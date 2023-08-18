const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const port = 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/lobby/`{username}`", (req, res) => {
  res.sendFile(__dirname + "/public/lobby.html");
});

// When a new user connects
io.on("connection", (socket) => {
  console.log(`A new user connected: ${socket.id}`);

  let username; // Declare a variable to store the username
  // Listen for the "user_connected" event
  socket.on("user_connected", (user) => {
    username = user; // Store the username
    // Broadcast the user information to other users in the room
    socket.broadcast.emit("user_information_to_other_in_room", username);
    // Send a welcome message to the new user
    socket.emit("message_to_new_user", username);
  });

  socket.on("join_room", (room) => {
    // Join the specified room
    socket.join(room);
  });

  // Listen for the "leave_room" event
  socket.on("leave_room", (room) => {
    // Leave the specified room
    socket.leave(room);
  });

  // Listen for the "disconnect" event
  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
    // Emit the "user_disconnected" event with the username
    socket.broadcast.emit("user_disconnected", username); // Broadcast the username
  });
});

server.listen(port, () => console.log(`Listening on port: ${port}`));

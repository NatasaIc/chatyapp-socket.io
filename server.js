const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const port = 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Initialize arrays to store users and rooms
const connectedUsers = [];
const createdRooms = [];
console.log(createdRooms);

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/lobby", (req, res) => {
  res.sendFile(__dirname + "/public/lobby.html");
});

// When a new user connects
io.on("connection", (socket) => {
  console.log(`User connected to server with ID ${socket.id}`);
  let username;
  // Declare a variable to store the username
  // Listen for the "user_connected" event
  socket.on("user_connected", (user) => {
    username = user; // Store the username
    connectedUsers.push(username);
    io.emit("update_users_list", connectedUsers);
    console.log(`User connected ${username}`);
    console.log(io.sockets.adapter.rooms);
  });

  socket.on("create_room", (room) => {
    room = roomName;
    // Join the specified room
    createdRooms.push(roomName);
    io.emit("update_rooms_list", createdRooms);
    socket.join(roomName);
    socket.broadcast.emit("info_new_room", username);
  });

  // Listen for the "disconnect" event
  socket.on("disconnect", () => {
    console.log("User disconnected: ", username);

    if (username) {
      const index = connectedUsers.indexOf(username);
      if (index !== -1) connectedUsers.splice(index, 1);
      io.emit("update_users_list", connectedUsers);
    }
    // Emit the "user_disconnected" event with the username
    socket.emit("user_disconnected", username); // Broadcast the username
  });
});

server.listen(port, () => console.log(`Listening on port: ${port}`));

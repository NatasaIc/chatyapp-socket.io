const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const port = 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let connectedUsers = [];
let createdRooms = [];

const socketToUsername = {};
const rooms = {};

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/lobby", (req, res) => {
  res.sendFile(__dirname + "/public/lobby.html");
});

app.get("/room", (req, res) => {
  res.sendFile(__dirname + "/public/room.html");
});

// When a new user connects
io.on("connection", (socket) => {
  console.log(`A new user connected: ${socket.id}`);

  socket.on("user_connected_to_server", (username) => {
    socket.data.username = username;
    socketToUsername[socket.id] = username;

    app.get("/getSocketIdByUsername/:username", (req, res) => {
      const username = req.params.username;
      const socketId = Object.keys(socketToUsername).find(
        (id) => socketToUsername[id] === username
      );
      res.json({ socketId });
    });

    console.log(`A new user connected: ${username}`);
    console.log(io.sockets.adapter.rooms);
    // Listen for the "user_connected" event
    socket.on("user_connected", (user) => {
      username = user; // Store the username
      connectedUsers.push(username).toLocaleString;
      // Broadcast the user information to other users in the lobby
      io.emit("update_users_list", connectedUsers);
      socket.broadcast.emit("user_information_to_other_in_lobby", username);
      // Send a welcome message to the new user
      socket.emit("message_to_new_user", username);
    });

    socket.on("create-room", (room) => {
      socket.join(room);
      io.to(room).emit("join_new_room", room, username);

      createdRooms.push(room);
      io.emit("update_rooms_list", createdRooms);
      // Join the specified room
      socket.join(room);
      console.log("Alla rum", io.sockets.adapter.rooms);
    });

    socket.on("join_existing_room", (room, username) => {
      socket.join(room, username);
      io.emit("user_information_to_other_in_room", room, username);
    });

    socket.emit("update_rooms_list", createdRooms);
    socket.emit("update_users_list", connectedUsers);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.data.username);
    const index = connectedUsers.indexOf(socket.data.username);
    if (index !== -1) {
      connectedUsers.splice(index, 1);
      io.emit("update_users_list", connectedUsers);
      socket.broadcast.emit("user_disconnected", socket.data.username);
    }
  });
});

server.listen(port, () => console.log(`Listening on port: ${port}`));

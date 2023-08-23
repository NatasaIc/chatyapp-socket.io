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

    // socket.on("create_room", (room) => {
    //   socket.join(room);
    //   io.to(room).emit("join_new_room", room, username);

    //   console.log(io.sockets.adapter.rooms);

    //   createdRooms.push(room).toLocaleString;
    //   io.emit("update_rooms_list", createdRooms);

    //   // // Join the specified room
    //   // socket.join(room);
    //   // socket.broadcast.emit("user_information_to_other_in_room", username);
    // });

    io.of("/").adapter.on("create-room", (room) => {
      console.log(`room ${room} was created`);
      socket.to(room).emit("create_and_joined_room");
    });
    
    // // måste skapa senare (när man klickar på rummet i listan)
    // io.of("/").adapter.on("join-room", (room, id) => {
    //   console.log(`socket ${id} has joined room ${room}`);
    // });

    // io.emit("update_rooms_list", createdRooms);

    // socket.emit("message_to_new_user", username);

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

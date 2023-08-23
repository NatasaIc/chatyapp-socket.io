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

io.on("connection", (socket) => {
  socket.on("user_connected_to_server", (username) => {
    socket.data.username = username;
    socketToUsername[socket.id] = username;

    console.log(`A new user connected: ${username}`);
    console.log(io.sockets.adapter.rooms);

    // Inform other  in the lobby about the new user
    socket.broadcast.emit(
      "user_information_to_other_in_lobby",
      socket.data.username
    );

    socket.on("create_room", (room) => {
      socket.join(room);
      io.to(room).emit("join_new_room", room, socket.data.username);

      console.log(io.sockets.adapter.rooms);

      createdRooms.push(room);
      io.emit("update_rooms_list", createdRooms);
    });
  });

  socket.on("user_connected", (user) => {
    socket.data.username = user;

    connectedUsers.push(user);

    socket.emit("message_to_new_user", user);

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

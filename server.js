const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const port = 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const createdRooms = [];
const connectedUsers = [];

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
  console.log(`A new user connected: ${socket.id}`);

  socket.on("user_connected_to_server", (username) => {
    socket.username = username;
    console.log(`A new user connected: ${username}`);

    connectedUsers.push(username);
    io.emit("update_users_list", connectedUsers);

    socket.on("create-room", (room) => {
      socket.join(room);
      console.log("joined " + room);
      
      console.log(createdRooms);

      createdRooms.push(room);

      console.log(createdRooms);

      io.emit("update_rooms_list", createdRooms);
    });

    io.emit("update_rooms_list", createdRooms);
    io.emit("update_users_list", connectedUsers);

    socket.on("join-room", (room) => {
      socket.join(room);
      console.log("rummet heter" + room)
      socket.emit("roomName_to_current_room", room);
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
});

server.listen(port, () => console.log(`Listening on port: ${port}`));

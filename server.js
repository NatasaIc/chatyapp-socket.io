const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const port = 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const createdRooms = [];
const connectedUsers = [];

const usersInRooms = {};

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
  console.log("Listan med användare från server innan:" + connectedUsers);

  socket.on("user_connected_to_server", (username) => {
    socket.username = username;
    console.log(`A new user connected: ${username}`);

    connectedUsers.push(username);
    io.emit("update_users_list", connectedUsers);
    console.log("Listan med användare från server:" + connectedUsers);
  });

  socket.on("create-room", (room) => {
    socket.join(room);
    console.log("joined " + room);

    console.log("rumslistan innan nytt pushats: " + createdRooms);
    createdRooms.push(room);
    console.log("rumslistan efter pushat: " + createdRooms);

    io.emit("update_rooms_list", createdRooms);
  });

  io.emit("update_rooms_list", createdRooms);

  io.emit("update_rooms_with_users_list", usersInRooms);
  console.log("Vi testar här" + usersInRooms);

  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(socket.username + " joinar " + room);

    // Skapa listan för detta rum om det inte finns
    if (!usersInRooms[room]) {
      usersInRooms[room] = [];
    }

    usersInRooms[room].push(socket.username);

    // Lagra rummet som en egenskap i socket-objektet
    socket.room = room;

    console.log("listan med användare i " + room + ": " + usersInRooms[room]);

    io.to(room).emit("update_user_in_roomlist", usersInRooms[room]);
  });

  // event när användaren börjar skriva
  socket.on("user_typing", () => {
    socket.broadcast.to(socket.room).emit("user_typing", socket.username);
  });

  // event när användaren skickar meddelandet
  socket.on("send_message", (room, message) => {
    // Broadcastar meddelandet till alla användare i rummet
    io.to(room).emit("incoming_message", socket.username, message);

    // informerar andra användare att användaren slutat skriva
    io.to(socket.room).emit("user_stopped_typing");
  });
  socket.on("send_gif", (room, gifUrl) => {
    io.to(room).emit("receive_gif", socket.username, gifUrl);
  });

  console.log(io.sockets.adapter.rooms);

  socket.on("leave_room", (room) => {
    socket.leave(room);
  });

  console.log(io.sockets.adapter.rooms);

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.username);
    const index = connectedUsers.indexOf(socket.username);

    if (index !== -1) {
      connectedUsers.splice(index, 1);
      io.emit("update_users_list", connectedUsers);

      socket.broadcast.emit("user_disconnected", socket.username);
      console.log(
        "Listan med användare från server vid disconnect:" + connectedUsers
      );
      console.log("User disconnected after: ", socket.username);
    }

    // lagra room och user i variabler för att använda i timeout:en 
    const room = socket.room;
    const username = socket.username;

    //Denna fördröjning ger tid för servern att kontrollera om användarens rum är tomt efter att de kopplat bort.
    setTimeout(() => {
      if (usersInRooms[room]) {
        const roomIndex = usersInRooms[room].indexOf(username);
        if (roomIndex !== -1) {
          usersInRooms[room].splice(roomIndex, 1);
          io.to(room).emit("update_user_in_roomlist", usersInRooms[room]);
          io.emit("update_rooms_with_users_list", usersInRooms);
          // om rummet är tomt, ta bort det från listan med aktiva rum 
          if (usersInRooms[room].length === 0) {
            const roomIndex = createdRooms.indexOf(room);
            if (roomIndex !== -1) {
              createdRooms.splice(roomIndex, 1);
              io.emit("update_rooms_list", createdRooms);
              io.emit("update_rooms_with_users_list", usersInRooms);
            }
          }
        }
      }
    }, 500); 
  });
});

console.log(io.sockets.adapter.rooms);

server.listen(port, () => console.log(`Listening on port: ${port}`));

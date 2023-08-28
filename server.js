const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const port = 3000;

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const createdRooms = [];
const connectedUsers = [];

// lista som ska uppdateras när man går in eller ut ur rummet (eller disconnectar)
// const usersInRoom = [];

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

    socket.on("create-room", (room) => {
      socket.join(room);
      console.log("joined " + room);
      
      console.log("rumslistan innan nytt pushats: " + createdRooms);
      createdRooms.push(room);
      console.log("rumslistan efter pushat: " + createdRooms);

      io.emit("update_rooms_list", createdRooms);
      console.log("testar nu: " + createdRooms);

      // io.emit("update_rooms_list", createdRooms);
    });

    io.emit("update_rooms_list", createdRooms);

    socket.on("join-room", (room) => {
      socket.join(room);
      console.log(socket.username + " joinar " + room);

            // Skapa listan för detta rum om det inte finns
            if (!usersInRooms[room]) {
              usersInRooms[room] = [];
            }
        
            usersInRooms[room].push(socket.username);

              // Lagra rummet som en egenskap i socket-objektet TEST FÖR DET HÄR MED DISCONNECT
            socket.room = room;
        
            console.log("listan med användare i " + room + ": " + usersInRooms[room]);
        
            io.to(room).emit("update_user_in_roomlist", usersInRooms[room]);
      
      socket.broadcast.to(room).emit("join_new_room", room, socket.username);

    });

    console.log(io.sockets.adapter.rooms);

    // ZOE //
    // sen ska vi fixa det här (gissning) när vi lämnar rummet (via knappen) - och då tas den bort
    // kom ihåg att om rummet är tomt så ska det tas bort - inbyggd funktion???
    // socket.on("leave-room", (room) => {
    //   socket.leave(room);
    //   console.log("rummet heter" + room)
    //   socket.emit("roomName_to_current_room", room);
    // });

    socket.on("disconnect", () => {
      console.log("User disconnected: ", socket.username);
      const index = connectedUsers.indexOf(socket.username);
      if (index !== -1) {
        connectedUsers.splice(index, 1);
        io.emit("update_users_list", connectedUsers);
        socket.broadcast.emit("user_disconnected", socket.username);
        console.log("Listan med användare från server vid disconnect:" + connectedUsers);
        console.log("User disconnected after: ", socket.username);
      }
    
  // Här startar vi en timeout på 1 sekund
  // const timeout = setTimeout(() => {
    const room = socket.room;
    if (usersInRooms[room]) {
      const roomIndex = usersInRooms[room].indexOf(socket.username);
      if (roomIndex !== -1) {
        usersInRooms[room].splice(roomIndex, 1);
        io.to(room).emit("update_user_in_roomlist", usersInRooms[room]);
      }
    }
  // }, 1000);
});

  });

  // ZOE //
  // vi måste ta bort den från listan när den är borta 
  // if (usersInRooms<0) {}

  console.log(io.sockets.adapter.rooms);


});

server.listen(port, () => console.log(`Listening on port: ${port}`));

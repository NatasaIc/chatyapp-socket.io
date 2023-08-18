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

  // här lyssnar på ett event där användaren har connectat och tar emot username
  socket.on("user_connected", (username) => {
    // här skickar vi iväg information (username) till de andra i rummet om att ny user connectat 
    socket.broadcast.emit("user_information_to_other_in_room", username); 
    // här skickar vi iväg information (username) till den person som connectat - men måste vi verkligen göra det, den informationen har ju redan script??
    socket.emit("message_to_new_user", username);
  });

  socket.on("user_disconnected", (username) => {
    socket.broadcast.emit("user_disconnected_information_to_other_in_room", username); 
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);  
  });

  socket.on("join_room", (room) => {
    socket.join(room);
  });

  socket.on("leave_room", (room) => {
    socket.leave(room);
  });
});





server.listen(port, () => console.log(`Listening on port: ${port}`));
const storedUsername = sessionStorage.getItem("username");
const storedSocketId = sessionStorage.getItem("socketId");
const storedRoomName = sessionStorage.getItem("roomName");

const socket = io();

const leaveBtn = document.getElementById("leaveBtn");
const chattInput = document.getElementById("chattInput");
const chattBtn = document.getElementById("chattBtn");
const chatt = document.getElementById("chatt");
const userList = document.getElementById("userList"); // Element för att visa användarlistan

const inRoom = () => {
  if (storedUsername) {
    displayMessage(`Välkommen till ${storedRoomName} ${storedUsername}`);
    socket.emit("user_connected_to_room", storedUsername);
  }

  if (storedRoomName) {
    console.log("namn från storage:" + storedRoomName);
    socket.emit("join-room", storedRoomName);
  }

  // Visa när någon ansluter till rummet
  socket.on("join_new_room", (room, username) => {
    displayMessage(`${username} joined ${room}`);
  });

  // Funktion för att skicka meddelanden - måste gå igenom
  const sendMessage = () => {
    const message = chattInput.value;
    socket.emit("send_message", storedRoomName, message);
    chattInput.value = "";
  };

  // Hantera inkommande meddelanden - måste gå igenom
  socket.on("incoming_message", (username, message) => {
    console.log(`Received message from ${username}: ${message}`);
    displayMessage(`${username}: ${message}`);
  });

  // Lyssna på chattknappen - måste gå igenom
  chattBtn.addEventListener("click", sendMessage);

  // Lyssna på Enter-tangenten i chattinputfältet - måste gå igenom
  chattInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  });

  // Uppdatera användarlistan
  socket.on("update_user_in_roomlist", (usersInRoom) => {
    console.log("användare: " + usersInRoom);

    userList.innerText = "";
    usersInRoom.forEach((user) => {
      const li = document.createElement("li");
      li.innerText = user;
      userList.appendChild(li);
    });
  });
};

// chatt - måste gå igenom
const displayMessage = (message) => {
  const li = document.createElement("li");
  li.innerText = message;
  chatt.appendChild(li);
};

// Anslut till rummet med det lagrade användarnamnet - måste gå igenom
socket.on("connect", () => {
  if (storedUsername) {
    socket.emit("user_connected_to_server", storedUsername);
  }

  inRoom();
});

//   // måste komma ihåg att rensa i storage när vi lämnar sidan sen - typ vid knappen eller dylikt: // vet inte om det behövs
//   // Rensa upp i sessionStorage när användaren lämnar sidan
// window.addEventListener("beforeunload", () => {
//     sessionStorage.removeItem("roomName");
//   });

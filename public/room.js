const storedUsername = sessionStorage.getItem("username");
const storedSocketId = sessionStorage.getItem("socketId");
const storedRoomName = sessionStorage.getItem("roomName");

const socket = io();

const leaveBtn = document.getElementById("leaveBtn");
const chattInput = document.getElementById("chattInput");
const chattBtn = document.getElementById("chattBtn");
const chatt = document.getElementById("chatt");
const userList = document.getElementById("userList"); // Element för att visa användarlistan

// chatt
const displayMessage = (message) => {
  const li = document.createElement("li");
  li.innerText = message;
  chatt.appendChild(li);
};

// Anslut till rummet med det lagrade användarnamnet
if (storedUsername) {
  displayMessage(`Welcome to ${storedRoomName} ${storedUsername}`);
  socket.emit("user_connected_to_room", storedUsername);
}

if (storedRoomName) {
    console.log(storedRoomName);
}

// Visa när någon ansluter till rummet
socket.on("join_new_room", (room, username) => {
  displayMessage(`${username} joined ${room}`);
});

// Uppdatera användarlistan när användarinformation skickas
socket.on("update_users_list_in_room", (users) => {
  updateUserList(users);
});

// Hantera inkommande meddelanden
socket.on("incoming_message", (message) => {
  displayMessage(message);
});

// Funktion för att skicka meddelanden
const sendMessage = () => {
  const message = chattInput.value;
  socket.emit("send_message", message);
  displayMessage(`You: ${message}`);
  chattInput.value = "";
};

// Lyssna på chattknappen
chattBtn.addEventListener("click", sendMessage);

// Lyssna på Enter-tangenten i chattinputfältet
chattInput.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

// Uppdatera användarlistan
const updateUserList = (users) => {
  userList.innerHTML = ""; // Rensa användarlistan
  users.forEach((username) => {
    const li = document.createElement("li");
    li.innerText = username;
    userList.appendChild(li);
  });
};

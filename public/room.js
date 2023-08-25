const storedUsername = sessionStorage.getItem("username");
const storedSocketId = sessionStorage.getItem("socketId");

const socket = io();

const leaveBtn = document.getElementById("leaveBtn");
const chattInput = document.getElementById("chattInput");
const chattBtn = document.getElementById("chattBtn");
const chatt = document.getElementById("chatt");

// chatt
const displayMessage = (message) => {
  const li = document.createElement("li");
  li.innerText = message;
  chatt.appendChild(li);
};

if (storedSocketId) {
  console.log("socket Id", storedSocketId);
}

if (storedUsername) {
  displayMessage(`Welcome to the room, ${storedUsername}`);
}

socket.on("join_new_room", (room, storedUsername) => {
  console.log(username);
  displayMessage(`${storedUsername} joined ${room}`);
  console.log(room);
  // här borde vi väl skicka username till listan med användare som är i rummet
});

socket.on("user_information_to_other_in_room", (room, username) => {});

// vi måste komma ihåg att rummet försvinner när listan på användare är tom

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

fetch(`/getSocketIdByUsername/${storedUsername}`)
  .then((response) => response.json())
  .then((data) => {
    const socketId = data.socketId;
    // Now you have the socket.id associated with the storedUsername
    console.log("Socket ID associated with username:", socketId);
    // You can use this socketId as needed
  })
  .catch((error) => {
    console.error("Error fetching socket ID:", error);
  });

if (storedUsername) {
  displayMessage(`Welcome to the room, ${storedUsername}`);
}

socket.on("join_new_room", (storedUsername) => {
  console.log(username);
  displayMessage(`${storedUsername} joind`);
  console.log(room);
  // här borde vi väl skicka username till listan med användare som är i rummet
});

socket.on("user_information_to_other_in_room", (storedUsername) => {
  displayMessage(`${storedUsername} joind`);
});

// vi måste komma ihåg att rummet försvinner när listan på användare är tom

const storedUsername = sessionStorage.getItem("username");
const storedSocketId = localStorage.getItem("socketId");

const socket = io();

const joinBtn = document.getElementById("join");
const leaveBtn = document.getElementById("leave");
const welcomeMessage = document.getElementById("welcomeMessage");
const usersList = document.getElementById("usersList");
const roomsList = document.getElementById("roomsList");
const createRoomBtn = document.getElementById("createRoom");
const createRoomInput = document.getElementById("createRoomInput");

const initChatty = () => {
  if (storedUsername) {
    displayMessage(`Welcome to the lobby, ${storedUsername}`);
  }

  // socket.on("update_users_list", (connectedUsers) => {
  //   usersList.innerHTML = ""; // Clear the previous list
  //   connectedUsers.forEach((username) => {
  //     const li = document.createElement("li");
  //     li.innerText = username;
  //     usersList.appendChild(li);
  //   });
  // });

  socket.on("message_to_new_user", (username) => {
    displayMessage(`Welcome to the lobby, ${username}`);
  });

  socket.on("user_information_to_other_in_lobby", (username) => {
    displayMessage(`${username} joined the lobby`);
  });

  socket.on("user_disconnected", (username) => {
    console.log(`User disconnected: ${username}`);
    displayMessage(`User ${username} disconnected`);
  });

  socket.on("update_rooms_list", (listOfRooms) => {
    displayRoomsList(listOfRooms);
  });

  const createRoom = () => {
    const room = createRoomInput.value;
    socket.emit("create-room", room);
    location.replace(`/room?room=${encodeURIComponent(room)}`); // måste vi väl ändra sen
  };

  createRoomBtn.addEventListener("click", createRoom);
};

// Define the displayMessage function
const displayMessage = (message) => {
  const li = document.createElement("li");
  li.innerText = message;
  welcomeMessage.appendChild(li);
};

socket.on("connect", () => {
  if (storedUsername) {
    socket.emit("user_connected_to_server", storedUsername);
  }

  initChatty();
});

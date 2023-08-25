const storedUsername = sessionStorage.getItem("username");
const storedSocketId = sessionStorage.getItem("socketId");

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
  // sessionStorage.setItem("room", room);

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
    const li = document.createElement("li");
    const a = document.createElement("a");
    li.appendChild(a);
    listOfRooms.forEach((room) => {
      a.setAttribute("href", `/room`);
      a.innerText = room;
      roomsList.appendChild(li);
      li.addEventListener("click", joinRoom);
    });
  });

  const joinRoom = () => {
    socket.emit("join_existing_room", storedUsername);
  };

  const createRoom = () => {
    const room = createRoomInput.value;
    socket.emit("create-room", room);
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

const socket = io({ autoConnect: false }); // den ska inte vara här, ska gå att lösa på något annat sätt

const joinBtn = document.getElementById("join");
const leaveBtn = document.getElementById("leave");
const welcomeMessage = document.getElementById("welcomeMessage");
const usersList = document.getElementById("usersList");
const roomsList = document.getElementById("roomsList");
const createRoomBtn = document.getElementById("createRoom");
const createRoomInput = document.getElementById("createRoomInput");

const displayMessage = (message) => {
  const li = document.createElement("li");
  li.innerText = message;
  welcomeMessage.appendChild(li);
};

// const urlSearchParams = new URLSearchParams(window.location.search);
// const params = Object.fromEntries(urlSearchParams.entries());

// if (params.username) {
//   const username = decodeURIComponent(params.username);
//   displayMessage(`Welcome to Chatty, ${username}`);
// }

const initChatty = () => {
  socket.on("update_users_list", (connectedUsers) => {
    usersList.innerHTML = "";
    const li = document.createElement("li");
    li.innerText = connectedUsers;
    usersList.appendChild(li);
  });

  // socket.emit("user_connected", params.username);

  socket.on("user_information_to_other_in_lobby", (username) => {
    displayMessage(`${username} joined the lobby`);
  });

  socket.on("user_disconnected", (username) => {
    console.log(`User disconnected: ${username}`);
    displayMessage(`User ${username} disconnected`);
  });

  const createRoom = () => {
    const roomName = createRoomInput.value;
    socket.emit("create_room", roomName);
    location.replace(`/room?room=${encodeURIComponent(roomName)}`);
  };

  // socket.on("update_rooms_list", (listOfRooms) => {
  //   roomsList.innerHTML = "";
  //   listOfRooms.forEach((room) => {
  //     const li = document.createElement("li");
  //     li.innerText = room;
  //     roomsList.appendChild(li);
  //   });
  // });

  createRoomBtn.addEventListener("click", createRoom);
};

initChatty();

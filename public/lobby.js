// här har vi INTE fixat till det än med chatNamespace // - ska fixas

const socket = io({ autoConnect: false });
const joinBtn = document.getElementById("join");
const leaveBtn = document.getElementById("leave");
const welcomeMessage = document.getElementById("welcomeMessage");
const usersList = document.getElementById("usersList");
const roomsList = document.getElementById("roomsList");
const createRoomBtn = document.getElementById("createRoom");
const createRoomInput = document.getElementById("createRoomInput");

// Function to display a message in the UI
const displayMessage = (message) => {
  const li = document.createElement("li");
  li.innerText = message;
  welcomeMessage.appendChild(li);
};

// Get username from query string
const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

if (params.username) {
  const username = decodeURIComponent(params.username);
  displayMessage(`Welcome to Chatty, ${username}`);
}

// Function to initialize the Chatty app
const initChatty = () => {
  socket.on("update_users_list", (connectedUsers) => {
    usersList.innerHTML = "";
    const li = document.createElement("li");
    li.innerText = connectedUsers;
    usersList.appendChild(li);
  });

  // Emit the "user_connected" event with the username
  socket.emit("user_connected", params.username);

  // move to room component
  // Listen for "user_information_to_other_in_room" event
  socket.on("user_information_to_other_in_lobby", (username) => {
    // Display a message when a user joins
    displayMessage(`${username} joined the lobby`);
  });

  // Listen for "user_disconnected" event
  socket.on("user_disconnected", (username) => {
    console.log(`User disconnected: ${username}`);
    displayMessage(`User ${username} disconnected`);
  });

  // skapar nytt rum // just nu bara det som sker i lobbyn
  const createRoom = () => {
    const roomName = createRoomInput.value;
    console.log(roomName);
    socket.emit("create_room", roomName);
    location.replace(`/room?room=${encodeURIComponent(roomName)}`);
  };

  socket.on("update_rooms_list", (listOfRooms) => {
    const li = document.createElement("li");
    listOfRooms.forEach((room) => {
      li.innerText = room;
      roomsList.appendChild(li);
    });
  });

  // skapar nytt rum // just nu bara det som sker i lobbyn
  createRoomBtn.addEventListener("click", createRoom);
};

initChatty(); // Call the initialization function

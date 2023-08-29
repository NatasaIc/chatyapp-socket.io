const storedUsername = sessionStorage.getItem("username");
const storedSocketId = sessionStorage.getItem("socketId");
const storedRoomName = sessionStorage.getItem("roomName");

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
    displayMessage(`Välkommen till Lobbyn ${storedUsername}`);
  }

  socket.on("user_disconnected", (username) => {
    console.log(`User disconnected: ${username}`);
  });

  const joinRoom = (roomName) => {
    socket.emit("join-room", roomName); // Anslut till det angivna rummet
    sessionStorage.setItem("roomName", roomName);

    location.replace(`/room`); // Byt till "rumsidan"
  };

  const createRoom = () => {
    const room = createRoomInput.value;
    socket.emit("create-room", room);
    joinRoom(room);
  };

  createRoomBtn.addEventListener("click", createRoom);

  socket.on("update_users_list", (updatedUsersList) => {
    console.log(updatedUsersList);
    usersList.innerText = "";
    updatedUsersList.forEach((user) => {
      const li = document.createElement("li");
      li.innerText = user;
      usersList.appendChild(li);
    });
  });

  socket.on("update_rooms_list", (updatedListOfRooms) => {
    console.log(updatedListOfRooms);
    roomsList.innerText = ""; // Rensa den befintliga listan
    updatedListOfRooms.forEach((room) => {
      const li = document.createElement("li");
      li.innerText = room;
      roomsList.appendChild(li);

      li.addEventListener("click", (event) => {
        const selectedRoom = event.target.innerText;
        if (selectedRoom) {
          joinRoom(selectedRoom);
          displayUsersInRoom(selectedRoom);
        }
      });
    });
  });
};

const displayUsersInRoom = (room) => {
  socket.emit("get_users_in_room", room, (usersInRoom) => {
    usersList.innerText = "Users in " + room + ":";
    usersInRoom.forEach((user) => {
      const li = document.createElement("li");
      li.innerText = user;
      usersList.appendChild(li);
    });
  });
};

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

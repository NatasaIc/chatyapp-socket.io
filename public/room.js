const storedUsername = sessionStorage.getItem("username");
const storedSocketId = sessionStorage.getItem("socketId");
const storedRoomName = sessionStorage.getItem("roomName");

const socket = io();

const h1 = document.getElementById("h1");
const leaveBtn = document.getElementById("leaveBtn");
const chattInput = document.getElementById("chattInput");
const chattBtn = document.getElementById("chattBtn");
const chatt = document.getElementById("chatt");
const userList = document.getElementById("userList");
const typingIndicator = document.getElementById("typingIndicator");
const searchInput = document.getElementById("gif-search");
const searchBtn = document.getElementById("gif-search-btn");
const gifDiv = document.getElementById("gifDiv");

const apiKey = "Ve81IpKHTwK7F5llof3SYaTP6fVhbARU";

const apiUrl = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}`;

function searchGifs(query) {
  return fetch(`${apiUrl}&q=${query}`)
    .then((response) => response.json())
    .then((data) => {
      const gifUrls = data.data.map((gif) => gif.images.original.url);
      return gifUrls;
    });
}

searchBtn.addEventListener("click", function () {
  const query = searchInput.value;
  searchGifs(query)
    .then((gifUrls) => {
      // Select a GIF from the results
      const gifUrl = gifUrls[Math.floor(Math.random() * gifUrls.length)];
      // Send a message with the GIF to the chat
      const gifImg = document.createElement("img");
      gifImg.src = gifUrl;
      chatt.append(gifImg);
      socket.emit("chat_message", room, message);
    })
    .catch((error) => {
      console.error(error);
    });
});

const inRoom = () => {
  if (storedUsername) {
    h1.innerText = `Chattrum: ${storedRoomName}`;
    displayMessage(`Välkommen till ${storedRoomName} ${storedUsername}`);
    socket.emit("user_connected_to_room", storedUsername);
  }

  if (storedRoomName) {
    console.log("namn från storage:" + storedRoomName);
    socket.emit("join-room", storedRoomName);
  }

  // Funktion för att skicka meddelanden
  const sendMessage = () => {
    const message = chattInput.value;
    socket.emit("send_message", storedRoomName, message);
    chattInput.value = "";
  };

  // Hantera inkommande meddelanden
  socket.on("incoming_message", (username, message) => {
    console.log(`Received message from ${username}: ${message}`);
    displayMessage(`${username}: ${message}`);
  });

  // Lyssna på chattknappen
  chattBtn.addEventListener("click", sendMessage);

  const leaveRoom = (room, username) => {
    socket.emit("leave_room", room);
    location.replace(`/lobby`);
    displayMessage(`${username} lämnade ${room}`);
  };

  leaveBtn.addEventListener("click", leaveRoom);

  // lyssnar på när användaren skriver
  chattInput.addEventListener("input", () => {
    socket.emit("user_typing");
    typingIndicator.classList.add("typing-animation");
  });

  // lyssnar på användaren slutar skriva
  chattInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
    socket.emit("user_stopped_typing");
    typingIndicator.classList.remove("typing-animation");
  });

  socket.on("user_typing", (username) => {
    typingIndicator.innerText = `${username} skriver`;
  });

  socket.on("user_stopped_typing", () => {
    typingIndicator.innerText = "";
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

// chatt
const displayMessage = (message) => {
  const li = document.createElement("li");
  li.innerText = message;
  chatt.appendChild(li);
};

// Anslut till rummet med det lagrade användarnamnet
socket.on("connect", () => {
  if (storedUsername) {
    socket.emit("user_connected_to_server", storedUsername);
  }

  inRoom();
});

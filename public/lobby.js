const socket = io({ autoConnect: false });
const joinBtn = document.getElementById("join");
const leaveBtn = document.getElementById("leave");
const welcomeMessage = document.getElementById("welcomeMessage");

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
  socket.connect();
  
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
};

initChatty(); // Call the initialization function

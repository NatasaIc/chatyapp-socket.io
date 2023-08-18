const socket = io({ autoConnect: false });
const startBtn = document.getElementById("createUsernameButton");
const joinBtn = document.getElementById("join");
const leaveBtn = document.getElementById("leave");

const input = document.getElementById("createUsernameInput");
const listOfMessage = document.getElementById("listOfMessage");

// Function to initialize the Chatty app
const initChatty = () => {
  socket.connect();
  const username = input.value;

  // Emit the "user_connected" event with the username
  socket.emit("user_connected", username);

  // Listen for "user_information_to_other_in_room" event
  socket.on("user_information_to_other_in_room", (username) => {
    // Display a message when a user joins
    displayMessage(`${username} joined Chatty`);
  });

  // Listen for "message_to_new_user" event
  socket.on("message_to_new_user", (username) => {
    displayMessage(`Welcome to Chatty ${username}`);
  });

  // Listen for "user_disconnected" event
  socket.on("user_disconnected", (username) => {
    console.log(`User disconnected: ${username}`);
    displayMessage(`User ${username} disconnected`);
  });
};

// Function to display a message in the UI
const displayMessage = (message) => {
  const li = document.createElement("li");
  li.innerText = message;
  listOfMessage.appendChild(li);
};

startBtn.addEventListener("click", initChatty);

joinBtn.addEventListener("click", () => {
  socket.emit("join_room", "123");
});

leaveBtn.addEventListener("click", () => {
  socket.emit("leave_room", "123");
});

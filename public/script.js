const socket = io({ autoConnect: false });
const startBtn = document.getElementById("createUsernameButton");
const joinBtn = document.getElementById("join");
const leaveBtn = document.getElementById("leave");

const input = document.getElementById("createUsernameInput");
const listOfMessage = document.getElementById("listOfMessage");

const initChatty = () => {
  socket.connect();

  const username = input.value;

  socket.emit("user_connected", username);

  socket.on("user_information_to_other_in_room", (username) => {
    const li = document.createElement("li");
    li.innerText = username + " " + "joined Chatty";
    listOfMessage.appendChild(li);
  })

  socket.on("message_to_new_user", (username) => {
    const li = document.createElement("li");
    li.innerText = "Welcome to Chatty " + username;
    listOfMessage.appendChild(li);
  });
  
};

startBtn.addEventListener("click", initChatty);

joinBtn.addEventListener("click", () => {
  socket.emit("join_room", "123");
});

leaveBtn.addEventListener("click", () => {
  socket.emit("leave_room", "123");
});

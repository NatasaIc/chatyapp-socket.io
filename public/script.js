const socket = io({ autoConnect: false });
const startBtn = document.getElementById("start");
const joinBtn = document.getElementById("join");
const leaveBtn = document.getElementById("leave");

const initChatty = () => {
  socket.connect();
};

startBtn.addEventListener("click", initChatty);

joinBtn.addEventListener("click", () => {
  socket.emit("join_room", "123");
});

leaveBtn.addEventListener("click", () => {
  socket.emit("leave_room", "123");
});

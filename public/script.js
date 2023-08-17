const socket = io({ autoConnect: false });
const startBtn = document.getElementById("createUsernameButton");
const joinBtn = document.getElementById("join");
const leaveBtn = document.getElementById("leave");

const input = document.getElementById("createUsernameInput");     
const listOfMessage = document.getElementById("listOfMessage");  

const initChatty = () => {
  // connectar //
  socket.connect();             

  const username = input.value;

  // här skickar vi iväg username när användaren connectar //
  socket.emit("user_connected", username);

  // här lyssnar vi på eventet till socket.broadcast - skickas info till alla andra om att personen kommit in //
  socket.on("user_information_to_other_in_room", (username) => {
    const li = document.createElement("li");
    li.innerText = username + " " + "joined Chatty";
    listOfMessage.appendChild(li);
  })

  // här lyssnar vi på eventet till socket - skickas välkomstmeddelande till den som connectat //
  socket.on("message_to_new_user", (username) => {
    const li = document.createElement("li");
    li.innerText = "Welcome to Chatty " + username;
    listOfMessage.appendChild(li);
  });
  
};

// klickar på knappen för att skapa användare och connecta - här borde vi kanske ha en verifiering??? //
startBtn.addEventListener("click", initChatty);

joinBtn.addEventListener("click", () => {
  socket.emit("join_room", "123");
});

leaveBtn.addEventListener("click", () => {
  socket.emit("leave_room", "123");
});

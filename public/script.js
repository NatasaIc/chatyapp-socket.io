// Skapa Socket.IO-anslutning med autoConnect: false
const socket = io({ autoConnect: false });

// Hitta knappen och input-elementet
const startBtn = document.getElementById("createUsernameButton");
const input = document.getElementById("createUsernameInput");

// Lägg till en klickhändelse för startknappen
startBtn.addEventListener("click", function () {
  const usernameCheck = input.value;
  if (usernameCheck.length < 1) {
    alert("Vänligen fyll i ett användarnamn");
    location.replace(`/`);
  }
  const username = usernameCheck;

  // Anslut till Socket.IO-servern
  socket.connect();

  // client-side
  socket.on("connect", () => {
    socket.emit("user_connected_to_server", username);

    // Save username in sessionStorage
    sessionStorage.setItem("username", username);

    location.replace(`/lobby`);
  });

  socket.on("connect_error", (error) => {
    console.error("Anslutningsfel:", error);
  });
});

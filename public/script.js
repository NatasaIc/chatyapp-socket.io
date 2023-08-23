// Skapa Socket.IO-anslutning med autoConnect: false
const socket = io({ autoConnect: false });

// Hitta knappen och input-elementet
const startBtn = document.getElementById("createUsernameButton");
const input = document.getElementById("createUsernameInput");

// Lägg till en klickhändelse för startknappen
startBtn.addEventListener("click", function () {
  const username = input.value;

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

function loadLobbyPage() {
  // Fetch the HTML content of the lobby page
  fetch("/lobby")
    .then((response) => response.text())
    .then((html) => {
      // Update the DOM with the fetched content
      document.body.innerHTML = html;
      // Initialize the lobby functionality after updating the DOM
      initChatty();
    })
    .catch((error) => {
      console.error("Error fetching lobby page:", error);
    });
}

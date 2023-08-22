// Skapa Socket.IO-anslutning med autoConnect: false
const socket = io({ autoConnect: false });

// Skapa en anslutning till det delade chatt-namespace
// const chatNamespace = io('/');

// Hitta knappen och input-elementet
const startBtn = document.getElementById("createUsernameButton");
const input = document.getElementById("createUsernameInput");

// Lägg till en klickhändelse för startknappen
startBtn.addEventListener("click", function () {
  const username = input.value;

  // Anslut till Socket.IO-servern
  socket.connect();

  // Lyssna på anslutningseventet
  socket.on('connect', () => {
    console.log('Ansluten till Socket.IO-servern');

    // Skicka användarnamn till servern
    socket.emit("user_connected_to_server", username);

    // Gå till lobby-sidan efter att användarnamnet har skickats
    location.replace(`/lobby`);
  });

  // Om det är problem att ansluta
  socket.on('connect_error', (error) => {
    console.error('Anslutningsfel:', error);
  });
});
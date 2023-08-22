// här har vi INTE fixat till det än med chatNamespace // - ska fixas

const socket = io ();
const leaveBtn = document.getElementById("leaveBtn");
const chattInput = document.getElementById("chattInput");
const chattBtn = document.getElementById("chattBtn");
const chatt = document.getElementById("chatt");

// ha en lista sen med alla som är i rummet (men ska väl skapas i servern?)

const searchParams = new URLSearchParams(window.location.search);
const paramsRoom = Object.fromEntries(searchParams.entries());

// chatt 
const displayMessage = (message) => {
    const li = document.createElement("li");
    li.innerText = message;
    chatt.appendChild(li);
  };

if (paramsRoom.room) {
    const room = decodeURIComponent(paramsRoom.room);
    displayMessage(`Välkommen till ${room}`)
}

socket.on("join_new_room", (room, username) => {
    console.log(username);
    displayMessage(`${username} joined ${room}`);
    // här borde vi väl skicka username till listan med användare som är i rummet 
})

// vi måste komma ihåg att rummet försvinner när listan på användare är tom
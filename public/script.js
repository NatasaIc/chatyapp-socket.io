const startBtn = document.getElementById("createUsernameButton");
const input = document.getElementById("createUsernameInput");

startBtn.addEventListener("click", function () {
  const username = input.value;
  redirectTo(username);
});

function redirectTo(username) {
  location.replace(`/lobby?username=${encodeURIComponent(username)}`);
}

// här behöver vi alltså göra connection och lägga in användarnamnet på socket.data - så vi senare 
// vi behöver ändra alla url:er 

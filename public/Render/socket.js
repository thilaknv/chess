import { myData } from "../Data/data.js";
import { manualEvent } from "../Events/global.js";
import { start } from "../app.js";
import { endGame } from "./main.js";

const socket = io('https://chezz-game-socketio-project.onrender.com');
// const socket = io('kingzgambit.vercel.app');

// const socket = io("http://localhost:3000");

const gameForms = document.querySelector(".game-forms");
const username1 = document.querySelector("#username1");
const username2 = document.querySelector("#username2");
const gameTime = document.querySelector("#game_time");
const myColor = document.querySelector("#my_color");
const joinRoomID = document.querySelector("#join_room");
const roomPage = document.querySelector(".room-page");
const usersList1 = document.querySelector(".usersList1");
const startButton = document.querySelector("#room_game_start");
const gameMoveChat = document.querySelector(".game-move-chat");
const msgList = document.querySelector(".msg-list");
const msgInput = document.querySelector("#msg-input");
const shareCode = document.querySelector("#shareCode");
const copyCodeIcon = document.querySelector("#copy-code");

const MY = { id: null, room: null };

document.querySelector(".create-form").addEventListener("submit", createRoom);
document.querySelector(".join-form").addEventListener("submit", joinRoom);
document.querySelector(".msg-form").addEventListener("submit", sendMessage);

copyCodeIcon.addEventListener("click", () => {
  copyCodeIcon.src = "./images/copied.png";
  navigator.clipboard.writeText(shareCode.innerText);
  setTimeout(() => {
    copyCodeIcon.src = "./images/copy.png";
  }, 2000);
});

function createRoom(event) {
  event.preventDefault();
  if (username1.value && gameTime.value && myColor.value) {
    socket.emit("createRoom", {
      host: username1.value,
      matchTime: gameTime.value,
      myColor: myColor.value,
    });
  }
}

function joinRoom(event) {
  event.preventDefault();
  if (username2.value && joinRoomID.value) {
    socket.emit("joinRoom", {
      name: username2.value,
      joinRoomID: joinRoomID.value,
    });
  }
}

function updateUserList(room, id) {
  MY.room = room;
  shareCode.innerText = `${room.CODE}`;
  if (room.CODE == "CLOSED") {
    shareCode.style.color = "red";
    copyCodeIcon.style.display = "none";
  }
  copyCodeIcon.style.display = "";

  usersList1.textContent = "";

  room &&
    room.users.forEach((user, i) => {
      if (room.P1.id != id || room.P1.id == user.id) {
        usersList1.innerHTML += `
                <div class="rp-list">
                    <div class="rp-list-label">
                        <h4 class="rp-list-h4">
                            ${user.id == id ? "You" : user.name}</h4>
                        <span class="rp-list-span">
                            ${user.id == room.P1.id ? "host" : "member"}</span>
                    </div>
                </div>
            `;
      } else {
        usersList1.innerHTML += `
                <div class="rp-list">
                    <input id="rad${i}" class="rp-list-radio" type="radio" name="P2" value="${
          user.id
        }">
                    <label for="rad${i}" class="rp-list-label">
                        <h4 class="rp-list-h4">
                            ${user.id == id ? "You" : user.name}</h4>
                        <span class="rp-list-span">
                            ${user.id == room.P1.id ? "host" : "member"}</span>
                    </label>
                </div>
            `;
      }
    });

  if (room.P1.id == socket.id) {
    if (room && room.users.length > 1) {
      startButton.style.display = "block";
    } else {
      startButton.style.display = "none";
    }
  }
}

roomPage.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(roomPage);
  const P2 = formData.get("P2");
  if (event.submitter.id == "room_game_start") {
    socket.emit("startGameChat", P2);
  } else {
    socket.emit("exitRoom");
    location.reload();
  }
});

function sendMessage(event) {
  event.preventDefault();
  const message = msgInput.value;
  if (message && message.length) {
    socket.emit("message", { text: message.trim() });
    msgInput.value = "";
  }
  // msgInput.focus();
}

function sendMove(fromId, toId) {
  socket.emit("sendMove", { fromId, toId });
  myData.myMove = false;
}

function getname(color) {
  if (MY.room) {
    if (color == MY.room.P1Color) {
      if (MY.room.P1.id == MY.id) {
        return "You";
      }
      return MY.room.P1.name;
    } else {
      if (MY.room.P2.id == MY.id) {
        return "You";
      }
      return MY.room.P2.name;
    }
  }
}

socket.on("roomPage", (room) => {
  MY.id = socket.id;
  updateUserList(room, socket.id);
  gameForms.style.display = "none";
  roomPage.style.display = "flex";
});

socket.on("updateRoom", (room) => updateUserList(room, socket.id));

socket.on("openGameChatBox", (room) => {
  MY.room = room;
  start(room, MY.id);
  roomPage.style.display = "none";
  document.querySelector(".playing-chess-image").style.display = "none";
  gameMoveChat.style.display = "flex";
});

socket.on("message", ({ user, text, time }) => {
  const li = document.createElement("div");
  li.style.color = user.color;
  if (!(socket.id == user.id)) {
    li.className = "msg-list-left";
    li.innerHTML = `<span class="msg-list-header">${user.name}</span>`;
  } else {
    li.className = "msg-list-right";
    li.innerHTML = "";
  }
  li.innerHTML += `
        <div class="msg-list-content">
            <span class="msg-list-message">${text}</span>
            <span class="msg-list-time">${time}</span>
        </div>
    `;

  msgList.appendChild(li);
  msgList.scrollTop = msgList.scrollHeight;
});

socket.on("recieveMove", ({ fromId, toId }) => {
  manualEvent(fromId, toId);
  myData.myMove = true;
});

socket.on("endGame", ({ exitedUserId }) => {
  if (exitedUserId == MY.room.P1.id) endGame(MY.room.P2Color);
  if (exitedUserId == MY.room.P2.id) endGame(MY.room.P1Color);
  return "Draw";
});

socket.on("ping", () => socket.emit("pong"));

function endGameState() {
  if (MY.id == MY.room.P1.id) socket.emit("endGameStatus");
}

export { sendMove, endGameState, gameMoveChat, getname };

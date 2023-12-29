import { myData } from "../Data/data.js";
import { manualEvent } from "../Events/global.js";
import { start } from "../app.js";

const socket = io('https://chezz-game-socketio-project.onrender.com');
// const socket = io('ws://localhost:3000');
// const socket = io();

const gameForms = document.querySelector('.game-forms');
const username1 = document.querySelector("#username1");
const username2 = document.querySelector("#username2");
const gameTime = document.querySelector("#game_time");
const myColor = document.querySelector("#my_color");
const joinRoomID = document.querySelector("#join_room");
const roomPage = document.querySelector(".room-page");
const usersList1 = document.querySelector('.usersList1');
const startButton = document.querySelector('#room_game_start');
const exitButton = document.querySelector('#room_game_exit');
const gameMoveChat = document.querySelector(".game-move-chat");
const msgList = document.querySelector(".msg-list");
const msgInput = document.querySelector('#msg-input');
const MY = { id: null, room: null }

document.querySelector(".create-form").addEventListener('submit', createRoom);
document.querySelector(".join-form").addEventListener('submit', joinRoom);
document.querySelector(".msg-form").addEventListener('submit', sendMessage);

function createRoom(event) {
    event.preventDefault();
    if (username1.value && gameTime.value && myColor.value) {
        socket.emit('createRoom', {
            host: username1.value,
            matchTime: gameTime.value,
            myColor: myColor.value
        });
    }
}

function joinRoom(event) {
    event.preventDefault();
    if (username2.value && joinRoomID.value) {
        socket.emit('joinRoom', {
            name: username2.value,
            joinRoomID: joinRoomID.value
        });
    }
}

function updateUserList(room, id) {
    document.querySelector('#shareCode').innerText = `${room.CODE}`;
    usersList1.textContent = '';

    room && room.users.forEach((user, i) => {
        if (room.P1.id != id || room.P1.id == user.id) {
            usersList1.innerHTML += `
                <div class="rp-list">
                    <div class="rp-list-label">
                        <img class="rp-list-img" src="./images/pieces/black/pawn.png" alt="">
                        <h4 class="rp-list-h4">
                            ${user.id == id ? 'You' : user.name}</h4>
                        <span class="rp-list-span">
                            ${user.id == room.P1.id ? 'host' : 'member'}</span>
                    </div>
                </div>
            `;
        } else {
            usersList1.innerHTML += `
                <div class="rp-list">
                    <input id="rad${i}" class="rp-list-radio" type="radio" name="P2" value="${user.id}">
                    <label for="rad${i}" class="rp-list-label">
                        <img class="rp-list-img" src="./images/pieces/black/pawn.png" alt="">
                        <h4 class="rp-list-h4">
                            ${user.id == id ? 'You' : user.name}</h4>
                        <span class="rp-list-span">
                            ${user.id == room.P1.id ? 'host' : 'member'}</span>
                    </label>
                </div>
            `;
        }
    });

    if (room.P1.id == socket.id) {
        if (room && room.users.length > 1) {
            startButton.style.display = 'block';
        } else {
            startButton.style.display = 'none';
        }
    }
}


roomPage.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(roomPage);
    const P2 = formData.get("P2");
    if (event.submitter.id == "room_game_start") {
        socket.emit('startGameChat', P2);
    }
});

function sendMessage(event) {
    event.preventDefault();
    const message = msgInput.value;
    if (message && message.length) {
        socket.emit('message', { text: message.trim() });
        msgInput.value = '';
    }
    // msgInput.focus();
};

function sendMove(fromId, toId) {
    socket.emit('sendMove', { fromId, toId });
    myData.myMove = false;
}

socket.on('roomPage', room => {
    MY.room = room;
    MY.id = socket.id;
    updateUserList(room);
    gameForms.style.display = 'none';
    roomPage.style.display = 'flex';
});

socket.on('updateRoomPage', room => updateUserList(room, socket.id));

socket.on('openGameChatBox', room => {
    start(room, MY.id);
    roomPage.style.display = 'none';
    gameMoveChat.style.display = 'flex';
});

socket.on('message', ({ user, text, time }) => {
    const li = document.createElement('div');
    if (!(socket.id == user.id)) {
        li.className = 'msg-list-left';
        li.innerHTML = `<span class="msg-list-header">${user.name}</span> `;
    } else {
        li.className = 'msg-list-right';
        li.innerHTML = '';
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

socket.on('recieveMove', ({ fromId, toId }) => {
    manualEvent(fromId, toId);
    myData.myMove = true;
});


export {
    sendMove, gameMoveChat
}
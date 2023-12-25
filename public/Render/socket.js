const socket = io('https://chezz-game-socketio-project.onrender.com');
// const socket = io();

const gameForms = document.querySelector('.game-forms');
const username1 = document.querySelector("#username1");
const username2 = document.querySelector("#username2");
const gameTime = document.querySelector("#game_time");
const myColor = document.querySelector("#my_color");
const joinRoomID = document.querySelector("#join_room");
const roomPage = document.querySelector(".room-page");
const usersList1 = document.querySelector('.usersList1');
const start = () => console.log("Game Starts Here");


document.querySelector(".create-form").addEventListener('submit', createRoom);
document.querySelector(".join-form").addEventListener('submit', joinRoom);

function createRoom(event) {
    event.preventDefault();
    console.log(event);
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
    console.log(event);
    if (username2.value && joinRoomID.value) {
        socket.emit('joinRoom', {
            name: username2.value,
            joinRoomID: joinRoomID.value
        });
    }
}

socket.on('roomPage', room => {
    updateUserList(room);
    gameForms.style.display = 'none';
    roomPage.style.display = 'flex';
});

socket.on('updateRoomPage', room => updateUserList(room));

function updateUserList(room) {
    document.querySelector('#shareCode').innerText = `${room.CODE}`;
    usersList1.textContent = '';
    room && room.users.forEach((user, i) => {
        usersList1.innerHTML += `   
            <div class="rp-list">
                <input id="rad${i}" class="rp-list-radio" type="radio" name="P2" value="${user.id}">
                <label for="rad${i}" class="rp-list-label">
                    <img for="abc" class="rp-list-img" src="./images/pieces/black/pawn.png" alt="">
                    <h4 for="abc" class="rp-list-h4">${user.name}</h4>
                    <span for="abc" class="rp-list-span">${user.id == room.P1.id ? 'host' : 'member'}</span>
                </label>
            </div>
        `;
    });
}

export {
}
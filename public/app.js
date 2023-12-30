import { initGame, myData } from "./Data/data.js";
import { initGameRender } from "./Render/main.js"
import { globalEvent } from "./Events/global.js";

const flip_nav = document.querySelector('#flip_nav');
const openChatBox_nav = document.querySelector('#openChatBox_nav');
const openMovesBox_nav = document.querySelector('#openMovesBox_nav');
const movesBox = document.querySelector('#movesBox');
const chatBox = document.querySelector('#chatBox');

const player_name = {
    black: null,
    white: null
}
var gameState;
var fliped = false;

function start(room, id) {
    
    gameState = initGame();
    initGameRender(gameState);
    player_name[room.P1Color] = room.P1.name;
    player_name[room.P2Color] = room.P2.name;
    document.querySelector('#player_B').innerText = player_name['black'];
    document.querySelector('#player_W').innerText = player_name['white'];

    if (room && room.P1.id && room.P2.id && (id == room.P1.id || id == room.P2.id)) {

        if (room.P1.id == id) {
            myData.color = room.P1Color;
            myData.isPlayer = true;
            myData.myMove = room.P1Color == 'white';
        } else if (room.P2.id == id) {
            myData.color = room.P2Color;
            myData.isPlayer = true;
            myData.myMove = room.P2Color == 'white';
        }

        globalEvent();
        myData.color == 'black' && flip();
        // alignBoard();
    }
}

function flip() {
    if (fliped) {
        document.querySelector('.p-b-p').style.flexDirection = "column";
        document.querySelector('#board').style.flexDirection = "column";
    } else {
        document.querySelector('.p-b-p').style.flexDirection = "column-reverse";
        document.querySelector('#board').style.flexDirection = "column-reverse";
    }
    fliped = !fliped;
}

flip_nav.addEventListener('click', flip);

openChatBox_nav.addEventListener('click', (e) => {
    if (movesBox.classList.contains('display_nav2')) {
        movesBox.classList.remove('display_nav2');
    }
    chatBox.classList.toggle('display_nav1');
});

openMovesBox_nav.addEventListener('click', (e) => {
    if (chatBox.classList.contains('display_nav1')) {
        chatBox.classList.remove('display_nav1');
    }
    movesBox.classList.toggle('display_nav2');
});

export {
    start, flip, fliped, gameState, player_name
};
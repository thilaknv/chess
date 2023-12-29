import { initGame, myData } from "./Data/data.js";
import { initGameRender } from "./Render/main.js"
import { globalEvent } from "./Events/global.js";
import { gameMoveChat } from "./Render/socket.js";

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
        alignBoard();
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

function alignBoard() {
    const width = document.querySelector('body').offsetWidth;
    const height = document.querySelector('body').offsetHeight;
    if (width < height * 1.92) {
        gameMoveChat.style.flexDirection = 'column';
        gameMoveChat.scrollTop = '0px';
    }
}

export {
    start, flip, fliped, gameState, player_name
};
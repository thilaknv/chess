import { initGame, myData } from "./Data/data.js";
import { initGameRender } from "./Render/main.js"
import { globalEvent } from "./Events/global.js";


var gameState = initGame();
var fliped = false;

function start(room, id) {
    gameState = initGame();
    initGameRender(gameState);

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
    }
}

function flip() {
    if (fliped) {
        document.querySelector('.p-b-p').style.flexDirection = "column";
        document.querySelector('#board').style.flexDirection = "column";
    } else {
        console.log("here");
        document.querySelector('.p-b-p').style.flexDirection = "column-reverse";
        document.querySelector('#board').style.flexDirection = "column-reverse";
    }
    fliped = !fliped;
}

export {
    gameState, start, fliped
};
import { initGame } from "./Data/data.js";
import { initGameRender } from "./Render/main.js"
import { globalEvent } from "./Events/global.js";

const gameState = initGame();
initGameRender(gameState);
// globalEvent();


function start(){

}

export {
    gameState
};
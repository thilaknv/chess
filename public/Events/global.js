import { BOARD } from "../Data/constants.js";
import { gameState } from "../app.js";
import {
    highLightSqRender, remHighLightSqRender, renderSquares, capturableSqRender,
    RemCapturableSqRender, selectedSqRender,
    remSelectedSqRender
} from "../Render/main.js";
import { alpha } from "../Data/data.js";

const action = {
    highLightSquares: [],
    capturableSquares: [],
    srcSquare: null,
    destSquare: null,
    prevMoveSquares: []
};

function searchInGameState(id) {
    const col = id.charCodeAt(0) - 97;
    const row = 8 - Number(id[1]);
    return gameState[row][col];
}

function whitePawnClick(square) {
    selectedSqRender(square);
    const piece = square.piece;
    const currentPosition = piece.currentPosition;
    const rank = currentPosition[1];
    const col = currentPosition[0];
    let destPiece;

    let destinId = `${col}${Number(rank) + 1}`;
    action.srcSquare = square;
    if (!searchInGameState(destinId).piece) {
        action.highLightSquares.push(destinId);
        destinId = `${col}${Number(currentPosition[1]) + 2}`;
        if (rank == 2 && !searchInGameState(destinId).piece) {
            action.highLightSquares.push(destinId);
        }
    }
    if (col != 'a') {
        destinId = `${alpha[col.charCodeAt(0) - 98]}${Number(rank) + 1}`;
        if ((destPiece = searchInGameState(destinId).piece)) {
            if (destPiece.pieceName[0] != square.piece.pieceName[0]) {
                action.capturableSquares.push(destinId);
            }
        }
    }
    if (col != 'h') {
        destinId = `${alpha[col.charCodeAt(0) - 96]}${Number(rank) + 1}`;
        if ((destPiece = searchInGameState(destinId).piece)) {
            if (destPiece.pieceName[0] != square.piece.pieceName[0]) {
                action.capturableSquares.push(destinId);
            }
        }
    }
    action.highLightSquares.forEach(highId => {
        highLightSqRender(highId);
    });
    action.capturableSquares.forEach(capId => {
        capturableSqRender(capId);
    });
}
function globalEvent() {
    BOARD.addEventListener("click", (event) => {
        const localName = event.target.localName;
        let clickSquareId = localName == 'div' ? event.target.id : event.target.parentNode.id;
        let check = true;

        if (action.highLightSquares.includes(clickSquareId) || action.capturableSquares.includes(clickSquareId)) {

            check = false;
            action.destSquare = searchInGameState(clickSquareId);
            const movingPiece = action.srcSquare.piece;

            movingPiece.currentPosition = clickSquareId;
            action.destSquare.piece = movingPiece;
            action.srcSquare.piece = undefined;

            if (action.prevMoveSquares.length)
                remSelectedSqRender(action.prevMoveSquares.pop());
            if (action.prevMoveSquares.length)
                remSelectedSqRender(action.prevMoveSquares.pop());

            renderSquares(action.srcSquare, action.destSquare);
            selectedSqRender(action.destSquare);

            action.prevMoveSquares.push(action.srcSquare);
            action.prevMoveSquares.push(action.destSquare);
        }

        // removing old highlights
        action.srcSquare && !action.prevMoveSquares.includes(action.srcSquare) && remSelectedSqRender(action.srcSquare);
        action.destSquare && !action.prevMoveSquares.includes(action.destSquare) && remSelectedSqRender(action.destSquare);

        while (action.highLightSquares.length > 0) {
            remHighLightSqRender(action.highLightSquares.pop());
        }
        while (action.capturableSquares.length > 0) {
            RemCapturableSqRender(action.capturableSquares.pop());
        }

        if (check && localName == 'img') {
            const square = searchInGameState(clickSquareId);
            if (square.piece.pieceName == 'whitePawn') {
                whitePawnClick(square);
            }
        }
    });
}

export {
    globalEvent, searchInGameState
}
import { gameState } from "../app.js";
import {
    highLightSqRender, remHighLightSqRender, renderSquares, capturableSqRender,
    RemCapturableSqRender, selectedSqRender,
    remSelectedSqRender
} from "../Render/main.js";
import { alpha, canCastle, BOARD, kingSquare } from "../Data/data.js";
import {
    topLeft, topRight, bottomLeft, bottomRight, left, right, top, bottom,
    checksFromBottom, checksFromBottomLeft, checksFromBottomRight, checksFromKnight,
    checksFromLeft, checksFromRight, checksFromTop, checksFromTopLeft, checksFromTopRight
} from "./traverse.js";

const action = {
    highLightSquares: [],
    capturableSquares: [],
    srcSquare: null,
    destSquare: null,
    prevMoveSquares: []
};

let checkPrevClickIsKing1 = false;
let checkPrevClickIsKing2 = true;

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
    if (rank == 8) return;

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
}

function blackPawnClick(square) {
    selectedSqRender(square);
    const piece = square.piece;
    const currentPosition = piece.currentPosition;
    const rank = currentPosition[1];
    const col = currentPosition[0];
    let destPiece;
    if (rank == 1) return;

    let destinId = `${col}${Number(rank) - 1}`;
    action.srcSquare = square;
    if (!searchInGameState(destinId).piece) {
        action.highLightSquares.push(destinId);
        destinId = `${col}${Number(currentPosition[1]) - 2}`;
        if (rank == 7 && !searchInGameState(destinId).piece) {
            action.highLightSquares.push(destinId);
        }
    }
    if (col != 'a') {
        destinId = `${alpha[col.charCodeAt(0) - 98]}${Number(rank) - 1}`;
        if ((destPiece = searchInGameState(destinId).piece)) {
            if (destPiece.pieceName[0] != square.piece.pieceName[0]) {
                action.capturableSquares.push(destinId);
            }
        }
    }
    if (col != 'h') {
        destinId = `${alpha[col.charCodeAt(0) - 96]}${Number(rank) - 1}`;
        if ((destPiece = searchInGameState(destinId).piece)) {
            if (destPiece.pieceName[0] != square.piece.pieceName[0]) {
                action.capturableSquares.push(destinId);
            }
        }
    }
}

function knightClick(square) {
    selectedSqRender(square);
    action.srcSquare = square;
    const piece = square.piece;
    const currentPosition = piece.currentPosition;
    const rank = Number(currentPosition[1]);
    const col = currentPosition.charCodeAt(0) - 96;

    const set = [];
    if (rank > 1) {
        if (col > 2) set.push(`${alpha[col - 3]}${rank - 1}`);
        if (col < 7) set.push(`${alpha[col + 1]}${rank - 1}`);
        if (rank > 2) {
            if (col > 1) set.push(`${alpha[col - 2]}${rank - 2}`);
            if (col < 8) set.push(`${alpha[col]}${rank - 2}`);
        }
    }
    if (rank < 8) {
        if (col > 2) set.push(`${alpha[col - 3]}${rank + 1}`);
        if (col < 7) set.push(`${alpha[col + 1]}${rank + 1}`);
        if (rank < 7) {
            if (col > 1) set.push(`${alpha[col - 2]}${rank + 2}`);
            if (col < 8) set.push(`${alpha[col]}${rank + 2}`);
        }
    }
    set.forEach(destId => {
        const destSquare = searchInGameState(destId);
        if (destSquare.piece) {
            if (destSquare.piece.pieceName[0] != square.piece.pieceName[0]) {
                action.capturableSquares.push(destId);
            }
        }
        else {
            action.highLightSquares.push(destId);
        }
    });
}

function bishopClick(square) {
    selectedSqRender(square);
    action.srcSquare = square;
    const piece = square.piece;
    const currentPosition = piece.currentPosition;
    const rank = Number(currentPosition[1]);
    const col = currentPosition.charCodeAt(0) - 96;

    topLeft(action.highLightSquares, action.capturableSquares, 7 - Number(square.id[1]), square.id.charCodeAt(0) - 98, piece.pieceName[0]);
    topRight(action.highLightSquares, action.capturableSquares, 7 - Number(square.id[1]), square.id.charCodeAt(0) - 96, piece.pieceName[0]);
    bottomLeft(action.highLightSquares, action.capturableSquares, 9 - Number(square.id[1]), square.id.charCodeAt(0) - 98, piece.pieceName[0]);
    bottomRight(action.highLightSquares, action.capturableSquares, 9 - Number(square.id[1]), square.id.charCodeAt(0) - 96, piece.pieceName[0]);
}

function rookClick(square) {
    selectedSqRender(square);
    action.srcSquare = square;
    const piece = square.piece;
    const currentPosition = piece.currentPosition;
    const rank = Number(currentPosition[1]);
    const col = currentPosition.charCodeAt(0) - 96;

    top(action.highLightSquares, action.capturableSquares, 7 - Number(square.id[1]), square.id.charCodeAt(0) - 97, piece.pieceName[0]);
    bottom(action.highLightSquares, action.capturableSquares, 9 - Number(square.id[1]), square.id.charCodeAt(0) - 97, piece.pieceName[0]);
    left(action.highLightSquares, action.capturableSquares, 8 - Number(square.id[1]), square.id.charCodeAt(0) - 98, piece.pieceName[0]);
    right(action.highLightSquares, action.capturableSquares, 8 - Number(square.id[1]), square.id.charCodeAt(0) - 96, piece.pieceName[0]);
}

function queenClick(square) {
    selectedSqRender(square);
    action.srcSquare = square;
    const piece = square.piece;
    const currentPosition = piece.currentPosition;
    const rank = Number(currentPosition[1]);
    const col = currentPosition.charCodeAt(0) - 96;

    topLeft(action.highLightSquares, action.capturableSquares, 7 - Number(square.id[1]), square.id.charCodeAt(0) - 98, piece.pieceName[0]);
    topRight(action.highLightSquares, action.capturableSquares, 7 - Number(square.id[1]), square.id.charCodeAt(0) - 96, piece.pieceName[0]);
    bottomLeft(action.highLightSquares, action.capturableSquares, 9 - Number(square.id[1]), square.id.charCodeAt(0) - 98, piece.pieceName[0]);
    bottomRight(action.highLightSquares, action.capturableSquares, 9 - Number(square.id[1]), square.id.charCodeAt(0) - 96, piece.pieceName[0]);
    top(action.highLightSquares, action.capturableSquares, 7 - Number(square.id[1]), square.id.charCodeAt(0) - 97, piece.pieceName[0]);
    bottom(action.highLightSquares, action.capturableSquares, 9 - Number(square.id[1]), square.id.charCodeAt(0) - 97, piece.pieceName[0]);
    left(action.highLightSquares, action.capturableSquares, 8 - Number(square.id[1]), square.id.charCodeAt(0) - 98, piece.pieceName[0]);
    right(action.highLightSquares, action.capturableSquares, 8 - Number(square.id[1]), square.id.charCodeAt(0) - 96, piece.pieceName[0]);
}

function kingClick(square, color) {
    selectedSqRender(square);
    action.srcSquare = square;
    const piece = square.piece;
    const currentPosition = piece.currentPosition;
    const rank = Number(currentPosition[1]);
    const col = currentPosition.charCodeAt(0) - 97;

    const set = [];
    if (rank < 8) {
        if (col > 0) set.push(`${alpha[col - 1]}${rank + 1}`);
        if (col < 7) set.push(`${alpha[col + 1]}${rank + 1}`);
        set.push(`${alpha[col]}${rank + 1}`);
    }
    if (rank > 1) {
        if (col > 0) set.push(`${alpha[col - 1]}${rank - 1}`);
        if (col < 7) set.push(`${alpha[col + 1]}${rank - 1}`);
        set.push(`${alpha[col]}${rank - 1}`);
    }
    if (col > 0) set.push(`${alpha[col - 1]}${rank}`);
    if (col < 7) set.push(`${alpha[col + 1]}${rank}`);

    set.forEach(destId => {
        const destSquare = searchInGameState(destId);
        if (destSquare.piece) {
            if (destSquare.piece.pieceName[0] != color[0]) {
                action.capturableSquares.push(destId);
            }
        }
        else {
            action.highLightSquares.push(destId);
        }
    });

    if (canCastle[color].status) {
        castlingHelper(color);
    }
}

function castlingHelper(color) {
    const rank = color == "black" ? 8 : 1;
    const colorType = canCastle[color];
    // shortside rook
    if (!canCastle[color][`rookh${rank}Moved`] && !searchInGameState(`f${rank}`).piece && !searchInGameState(`g${rank}`).piece) {
        action.highLightSquares.push(`h${rank}`);
        action.highLightSquares.push(`g${rank}`);
        checkPrevClickIsKing1 = true;
    }

    // longside rook
    if (!canCastle[color][`rooka${rank}Moved`] && !searchInGameState(`d${rank}`).piece && !searchInGameState(`c${rank}`).piece && !searchInGameState(`b${rank}`).piece) {
        action.highLightSquares.push(`a${rank}`);
        action.highLightSquares.push(`c${rank}`);
        checkPrevClickIsKing1 = true;
    }

}

function checkForKing(color) {
    let id = kingSquare[color == 'black' ? 'white' : 'black'].currentPosition;
    const row = 8 - Number(id[1]);
    const col = id.charCodeAt(0) - 97;

    let checks = checksFromTopLeft(row - 1, col - 1, color);
    checks += checksFromTop(row - 1, col, color);
    if (checks < 2) checks += checksFromTopRight(row - 1, col + 1, color);
    if (checks < 2) checks += checksFromLeft(row, col - 1, color);
    if (checks < 2) checks += checksFromRight(row, col + 1, color);
    if (checks < 2) checks += checksFromBottomLeft(row + 1, col - 1, color);
    if (checks < 2) checks += checksFromBottomRight(row + 1, col + 1, color);
    if (checks < 2) checks += checksFromBottom(row + 1, col, color);
    if (checks < 2) checks += checksFromKnight(row, col, color);
    return checks;
}

function movementHelper(clickSquareId, movingPiece) {

    action.destSquare = searchInGameState(clickSquareId);
    movingPiece.currentPosition = clickSquareId;
    action.destSquare.piece = movingPiece;
    action.srcSquare.piece = undefined;

    if (checkPrevClickIsKing2) {
        while (action.prevMoveSquares.length)
            remSelectedSqRender(action.prevMoveSquares.pop());
    }

    renderSquares(action.srcSquare, action.destSquare);
    selectedSqRender(action.destSquare);
    selectedSqRender(action.srcSquare);

    action.prevMoveSquares.push(action.srcSquare);
    action.prevMoveSquares.push(action.destSquare);
}

function globalEvent() {
    BOARD.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });

    BOARD.addEventListener("click", (event) => {
        const localName = event.target.localName;
        let clickSquareId = localName == 'div' ? event.target.id : event.target.parentNode.id;
        let check = true;

        if (action.highLightSquares.includes(clickSquareId) || action.capturableSquares.includes(clickSquareId)) {
            checkPrevClickIsKing2 = true;

            const movingPiece = action.srcSquare.piece;
            const color = movingPiece.pieceName.includes("black") ? 'black' : 'white';

            check = false;

            if (checkPrevClickIsKing1) {
                if (clickSquareId[0] == 'h')
                    clickSquareId = `g${color == 'black' ? 8 : 1}`;
                if (clickSquareId[0] == 'a')
                    clickSquareId = `c${color == 'black' ? 8 : 1}`;
            }

            movementHelper(clickSquareId, movingPiece);

            if (checkPrevClickIsKing1) {
                checkPrevClickIsKing2 = false;
                let clickSquareId2 = `${clickSquareId[0] == 'g' ? 'f' : 'd'}${clickSquareId[1]}`;
                let tempId = `${clickSquareId[0] == 'g' ? 'h' : 'a'}${color == 'black' ? 8 : 1}`;
                action.srcSquare = searchInGameState(tempId);
                const movingPiece2 = action.srcSquare.piece;
                movementHelper(clickSquareId2, movingPiece2);
            }

            if (canCastle[color].status) {
                if (movingPiece.pieceName.includes("King")) {
                    canCastle[color].status = false;
                }
                else if (movingPiece.pieceName.includes("Rook")) {
                    const colChar = action.srcSquare.id.charAt(0);
                    if (colChar == 'a' || colChar == 'h') {
                        const rank = color == 'black' ? 8 : 1;
                        canCastle[color][`rook${colChar}${rank}Moved`] = true;
                        canCastle[color].status = !canCastle[color][`rooka${rank}Moved`] || !canCastle[color][`rookh${rank}Moved`];
                    }
                }
            }
            console.log(`Total Checks on ${color == 'black' ? 'white' : 'black'} ` + checkForKing(color));
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

        checkPrevClickIsKing1 = false;
        if (check && localName == 'img') {
            const square = searchInGameState(clickSquareId);
            switch (square.piece.pieceName) {
                case 'whitePawn': whitePawnClick(square); break;
                case 'blackPawn': blackPawnClick(square); break;
                case 'whiteKnight': case 'blackKnight': knightClick(square); break;
                case 'whiteBishop': case 'blackBishop': bishopClick(square); break;
                case 'whiteRook': case 'blackRook': rookClick(square); break;
                case 'whiteQueen': case 'blackQueen': queenClick(square); break;
                case 'whiteKing': kingClick(square, 'white'); break;
                case 'blackKing': kingClick(square, 'black'); break;
            }

            action.highLightSquares.forEach(highId => {
                highLightSqRender(highId);
            });

            action.capturableSquares.forEach(capId => {
                capturableSqRender(capId);
            });
        }
    });
}

export {
    globalEvent, searchInGameState
}
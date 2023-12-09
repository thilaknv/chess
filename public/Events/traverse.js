import { gameState } from "../app.js";
import { alpha } from "../Data/data.js";


function topLeft(highLightSquares, capturableSquares, i, j, type) {
    if (i < 0 || j < 0) return;
    if (gameState[i][j].piece) {
        if (type[0] != gameState[i][j].piece.pieceName[0]) {
            capturableSquares.push(`${alpha[j]}${8 - i}`);
        }
        return;
    }
    highLightSquares.push(`${alpha[j]}${8 - i}`);
    topLeft(highLightSquares, capturableSquares, i - 1, j - 1, type);
}
function topRight(highLightSquares, capturableSquares, i, j, type) {
    if (i < 0 || j > 7) return;
    if (gameState[i][j].piece) {
        if (type[0] != gameState[i][j].piece.pieceName[0]) {
            capturableSquares.push(`${alpha[j]}${8 - i}`);
        }
        return;
    }
    highLightSquares.push(`${alpha[j]}${8 - i}`);
    topRight(highLightSquares, capturableSquares, i - 1, j + 1, type);
}
function bottomLeft(highLightSquares, capturableSquares, i, j, type) {
    if (i > 7 || j < 0) return;
    if (gameState[i][j].piece) {
        if (type[0] != gameState[i][j].piece.pieceName[0]) {
            capturableSquares.push(`${alpha[j]}${8 - i}`);
        }
        return;
    }
    highLightSquares.push(`${alpha[j]}${8 - i}`);
    bottomLeft(highLightSquares, capturableSquares, i + 1, j - 1, type);
}
function bottomRight(highLightSquares, capturableSquares, i, j, type) {
    if (i > 7 || j > 7) return;
    if (gameState[i][j].piece) {
        if (type[0] != gameState[i][j].piece.pieceName[0]) {
            capturableSquares.push(`${alpha[j]}${8 - i}`);
        }
        return;
    }
    highLightSquares.push(`${alpha[j]}${8 - i}`);
    bottomRight(highLightSquares, capturableSquares, i + 1, j + 1, type);
}
function top(highLightSquares, capturableSquares, i, j, type) {
    if (i < 0) return;
    if (gameState[i][j].piece) {
        if (type[0] != gameState[i][j].piece.pieceName[0]) {
            capturableSquares.push(`${alpha[j]}${8 - i}`);
        }
        return;
    }
    highLightSquares.push(`${alpha[j]}${8 - i}`);
    top(highLightSquares, capturableSquares, i - 1, j, type);
}
function bottom(highLightSquares, capturableSquares, i, j, type) {
    if (i > 7) return;
    if (gameState[i][j].piece) {
        if (type[0] != gameState[i][j].piece.pieceName[0]) {
            capturableSquares.push(`${alpha[j]}${8 - i}`);
        }
        return;
    }
    highLightSquares.push(`${alpha[j]}${8 - i}`);
    bottom(highLightSquares, capturableSquares, i + 1, j, type);
}
function left(highLightSquares, capturableSquares, i, j, type) {
    if (j < 0) return;
    if (gameState[i][j].piece) {
        if (type[0] != gameState[i][j].piece.pieceName[0]) {
            capturableSquares.push(`${alpha[j]}${8 - i}`);
        }
        return;
    }
    highLightSquares.push(`${alpha[j]}${8 - i}`);
    left(highLightSquares, capturableSquares, i, j - 1, type);
}
function right(highLightSquares, capturableSquares, i, j, type) {
    if (j > 7) return;
    if (gameState[i][j].piece) {
        if (type[0] != gameState[i][j].piece.pieceName[0]) {
            capturableSquares.push(`${alpha[j]}${8 - i}`);
        }
        return;
    }
    highLightSquares.push(`${alpha[j]}${8 - i}`);
    right(highLightSquares, capturableSquares, i, j + 1, type);
}
export {
    topLeft, topRight, bottomLeft, bottomRight, left, right, top, bottom
}
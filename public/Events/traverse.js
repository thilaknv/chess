import { gameState } from "../app.js";
import { alpha, BOARD } from "../Data/data.js";
import { searchInGameState } from "./global.js";

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





function checksFromTopLeft(row, col, color, depth) {
    if (row < 0 || col < 0) return 0;
    const piece = gameState[row][col].piece;


    if (!piece)
        return checksFromTopLeft(row - 1, col - 1, color, 1);

    if (color[0] != piece.pieceName[0]) {
        return 0;
    }

    if (depth == 0 && color == 'black' && piece.pieceName == "blackPawn") {
        return 1;
    }

    if (piece.pieceName.includes('Bishop') || piece.pieceName.includes('Queen')) {
        return 1;
    }

    return 0;
}

function checksFromTop(row, col, color) {
    if (row < 0) return 0;
    const piece = gameState[row][col].piece;


    if (!piece)
        return checksFromTop(row - 1, col, color);

    if (color[0] != piece.pieceName[0]) {
        return 0;
    }

    if (piece.pieceName.includes('Rook') || piece.pieceName.includes('Queen')) {
        return 1;
    }

    return 0;
}

function checksFromTopRight(row, col, color, depth) {
    if (row < 0 || col > 7) return 0;
    const piece = gameState[row][col].piece;


    if (!piece)
        return checksFromTopRight(row - 1, col + 1, color, 1);

    if (color[0] != piece.pieceName[0]) {
        return 0;
    }

    if (depth == 0 && color == 'black' && piece.pieceName == "blackPawn") {
        return 1;
    }

    if (piece.pieceName.includes('Bishop') || piece.pieceName.includes('Queen')) {
        return 1;
    }

    return 0;
}

function checksFromLeft(row, col, color) {
    if (col < 0) return 0;
    const piece = gameState[row][col].piece;


    if (!piece)
        return checksFromLeft(row, col - 1, color, 1);

    if (color[0] != piece.pieceName[0]) {
        return 0;
    }

    if (piece.pieceName.includes('Rook') || piece.pieceName.includes('Queen')) {
        return 1;
    }

    return 0;
}

function checksFromRight(row, col, color) {
    if (col > 7) return 0;
    const piece = gameState[row][col].piece;


    if (!piece)
        return checksFromRight(row, col + 1, color, 1);

    if (color[0] != piece.pieceName[0]) {
        return 0;
    }

    if (piece.pieceName.includes('Rook') || piece.pieceName.includes('Queen')) {
        return 1;
    }

    return 0;
}

function checksFromBottomLeft(row, col, color, depth) {
    if (row > 7 || col < 0) return 0;
    const piece = gameState[row][col].piece;


    if (!piece)
        return checksFromBottomLeft(row + 1, col - 1, color, 1);

    if (color[0] != piece.pieceName[0]) {
        return 0;
    }

    if (depth == 0 && color == 'white' && piece.pieceName == "whitePawn") {
        return 1;
    }

    if (piece.pieceName.includes('Bishop') || piece.pieceName.includes('Queen')) {
        return 1;
    }

    return 0;
}

function checksFromBottomRight(row, col, color, depth) {
    if (row > 7 || col > 7) return 0;
    const piece = gameState[row][col].piece;


    if (!piece)
        return checksFromBottomRight(row + 1, col + 1, color, 1);

    if (color[0] != piece.pieceName[0]) {
        return 0;
    }

    if (depth == 0 && color == 'white' && piece.pieceName == "whitePawn") {
        return 1;
    }

    if (piece.pieceName.includes('Bishop') || piece.pieceName.includes('Queen')) {
        return 1;
    }

    return 0;
}

function checksFromBottom(row, col, color) {
    if (row > 7) return 0;
    const piece = gameState[row][col].piece;


    if (!piece)
        return checksFromBottom(row + 1, col, color, 1);

    if (color[0] != piece.pieceName[0]) {
        return 0;
    }

    if (piece.pieceName.includes('Rook') || piece.pieceName.includes('Queen')) {
        return 1;
    }

    return 0;
}

function checksFromKnight(row, col, color) {
    let tempPiece;
    if (row > 0) {
        if (col > 1) if ((tempPiece = gameState[row - 1][col - 2].piece) && tempPiece.pieceName == `${color}Knight`) return 1;
        if (col < 6) if ((tempPiece = gameState[row - 1][col + 2].piece) && tempPiece.pieceName == `${color}Knight`) return 1;
        if (row > 1) {
            if (col > 0) if ((tempPiece = gameState[row - 2][col - 1].piece) && tempPiece.pieceName == `${color}Knight`) return 1;
            if (col < 7) if ((tempPiece = gameState[row - 2][col + 1].piece) && tempPiece.pieceName == `${color}Knight`) return 1;
        }
    }
    if (row < 7) {
        if (col > 1) if ((tempPiece = gameState[row + 1][col - 2].piece) && tempPiece.pieceName == `${color}Knight`) return 1;
        if (col < 6) if ((tempPiece = gameState[row + 1][col + 2].piece) && tempPiece.pieceName == `${color}Knight`) return 1;
        if (row < 6) {
            if (col > 0) if ((tempPiece = gameState[row + 2][col - 1].piece) && tempPiece.pieceName == `${color}Knight`) return 1;
            if (col < 7) if ((tempPiece = gameState[row + 2][col + 1].piece) && tempPiece.pieceName == `${color}Knight`) return 1;
        }
    }
    return 0;
}


export {
    topLeft, topRight, bottomLeft, bottomRight, left, right, top, bottom,
    checksFromBottom, checksFromBottomLeft, checksFromBottomRight, checksFromKnight,
    checksFromLeft, checksFromRight, checksFromTop, checksFromTopLeft, checksFromTopRight
}
import { gameState } from "../app.js";
import { alpha, BOARD, checkDetails, kingSquare, opposite } from "../Data/data.js";
import { kingClickHelper, searchInGameState } from "./global.js";

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



function addCheckDetails(row, col) {
    checkDetails.checker.row = row;
    checkDetails.checker.col = col;
}

function checksFromTop(row, col, color) {
    if (row < 0) return 0;
    const piece = gameState[row][col].piece;


    if (!piece)
        return checksFromTop(row - 1, col, color);

    if (color[0] != piece.pieceName[0]) {
        if (piece.pieceName.includes('King'))
            return checksFromTop(row - 1, col, color);
        return 0;
    }

    if (piece.pieceName.includes('Rook') || piece.pieceName.includes('Queen')) {
        addCheckDetails(row, col);
        return 1;
    }

    return 0;
}

function checksFromLeft(row, col, color) {
    if (col < 0) return 0;
    const piece = gameState[row][col].piece;


    if (!piece)
        return checksFromLeft(row, col - 1, color);

    if (color[0] != piece.pieceName[0]) {
        if (piece.pieceName.includes('King'))
            return checksFromLeft(row, col - 1, color);
        return 0;
    }

    if (piece.pieceName.includes('Rook') || piece.pieceName.includes('Queen')) {
        addCheckDetails(row, col);
        return 1;
    }

    return 0;
}

function checksFromRight(row, col, color) {
    if (col > 7) return 0;
    const piece = gameState[row][col].piece;


    if (!piece)
        return checksFromRight(row, col + 1, color);

    if (color[0] != piece.pieceName[0]) {
        if (piece.pieceName.includes('King'))
            return checksFromRight(row, col + 1, color);
        return 0;
    }

    if (piece.pieceName.includes('Rook') || piece.pieceName.includes('Queen')) {
        addCheckDetails(row, col);
        return 1;
    }

    return 0;
}

function checksFromBottom(row, col, color) {
    if (row > 7) return 0;
    const piece = gameState[row][col].piece;


    if (!piece)
        return checksFromBottom(row + 1, col, color);

    if (color[0] != piece.pieceName[0]) {
        if (piece.pieceName.includes('King'))
            return checksFromBottom(row + 1, col, color);
        return 0;
    }

    if (piece.pieceName.includes('Rook') || piece.pieceName.includes('Queen')) {
        addCheckDetails(row, col);
        return 1;
    }

    return 0;
}

function checksFromTopLeft(row, col, color, depth) {
    if (row < 0 || col < 0) return 0;
    const piece = gameState[row][col].piece;


    if (!piece)
        return checksFromTopLeft(row - 1, col - 1, color, 1);

    if (color[0] != piece.pieceName[0]) {
        if (piece.pieceName.includes('King'))
            return checksFromTopLeft(row - 1, col - 1, color, 1);
        return 0;
    }

    if (depth == 0 && color == 'black' && piece.pieceName == "blackPawn") {
        addCheckDetails(row, col);
        return 1;
    }

    if (piece.pieceName.includes('Bishop') || piece.pieceName.includes('Queen')) {
        addCheckDetails(row, col);
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
        if (piece.pieceName.includes('King'))
            return checksFromTopRight(row - 1, col + 1, color, 1);
        return 0;
    }

    if (depth == 0 && color == 'black' && piece.pieceName == "blackPawn") {
        addCheckDetails(row, col);
        return 1;
    }

    if (piece.pieceName.includes('Bishop') || piece.pieceName.includes('Queen')) {
        addCheckDetails(row, col);
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
        if (piece.pieceName.includes('King'))
            return checksFromBottomLeft(row + 1, col - 1, color, 1);
        return 0;
    }

    if (depth == 0 && color == 'white' && piece.pieceName == "whitePawn") {
        addCheckDetails(row, col);
        return 1;
    }

    if (piece.pieceName.includes('Bishop') || piece.pieceName.includes('Queen')) {
        addCheckDetails(row, col);
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
        if (piece.pieceName.includes('King'))
            return checksFromBottomRight(row + 1, col + 1, color, 1);
        return 0;
    }

    if (depth == 0 && color == 'white' && piece.pieceName == "whitePawn") {
        addCheckDetails(row, col);
        return 1;
    }

    if (piece.pieceName.includes('Bishop') || piece.pieceName.includes('Queen')) {
        addCheckDetails(row, col);
        return 1;
    }

    return 0;
}

function checksFromKnight(row, col, color) {
    let tempPiece, count = 0;
    let name = `${color}Knight`;
    if (row > 0) {
        if (col > 1 && (tempPiece = gameState[row - 1][col - 2].piece) && tempPiece.pieceName == name && (count = 1)) addCheckDetails(row - 1, col - 2);
        if (col < 6 && (tempPiece = gameState[row - 1][col + 2].piece) && tempPiece.pieceName == name && (count = 1)) addCheckDetails(row - 1, col + 2);
        if (row > 1) {
            if (col > 0 && (tempPiece = gameState[row - 2][col - 1].piece) && tempPiece.pieceName == name && (count = 1)) addCheckDetails(row - 2, col - 1);
            if (col < 7 && (tempPiece = gameState[row - 2][col + 1].piece) && tempPiece.pieceName == name && (count = 1)) addCheckDetails(row - 2, col + 1);
        }
    }
    if (row < 7) {
        if (col > 1 && (tempPiece = gameState[row + 1][col - 2].piece) && tempPiece.pieceName == name && (count = 1)) addCheckDetails(row + 1, col - 2);
        if (col < 6 && (tempPiece = gameState[row + 1][col + 2].piece) && tempPiece.pieceName == name && (count = 1)) addCheckDetails(row + 1, col + 2);
        if (row < 6) {
            if (col > 0 && (tempPiece = gameState[row + 2][col - 1].piece) && tempPiece.pieceName == name && (count = 1)) addCheckDetails(row + 2, col - 1);
            if (col < 7 && (tempPiece = gameState[row + 2][col + 1].piece) && tempPiece.pieceName == name && (count = 1)) addCheckDetails(row + 2, col + 1);
        }
    }
    return count;
}

function checksFromKing(row, col, color) {
    const kingName = `${color}King`;
    if (row > 0) {
        if (col > 0 && gameState[row - 1][col - 1].piece && gameState[row - 1][col - 1].piece.pieceName == kingName) return 1;
        if (col < 7 && gameState[row - 1][col + 1].piece && gameState[row - 1][col + 1].piece.pieceName == kingName) return 1;
        if (gameState[row - 1][col].piece && gameState[row - 1][col].piece.pieceName == kingName) return 1;
    }
    if (row < 7) {
        if (col > 0 && gameState[row + 1][col - 1].piece && gameState[row + 1][col - 1].piece.pieceName == kingName) return 1;
        if (col < 7 && gameState[row + 1][col + 1].piece && gameState[row + 1][col + 1].piece.pieceName == kingName) return 1;
        if (gameState[row + 1][col].piece && gameState[row + 1][col].piece.pieceName == kingName) return 1;
    }
    if (col > 0 && gameState[row][col - 1].piece && gameState[row][col - 1].piece.pieceName == kingName) return 1;
    if (col < 7 && gameState[row][col + 1].piece && gameState[row][col + 1].piece.pieceName == kingName) return 1;
    return 0;
}

function findKingsMoveOnCheckHelper(id, color) {
    const row = 8 - Number(id[1]);
    const col = id.charCodeAt(0) - 97;
    const color2 = opposite[color];
    if (checksFromKing(row, col, color2)) return false;
    if (checksFromKnight(row, col, color2)) return false;
    if (checksFromTop(row - 1, col, color2)) return false;
    if (checksFromLeft(row, col - 1, color2)) return false;
    if (checksFromRight(row, col + 1, color2)) return false;
    if (checksFromBottom(row + 1, col, color2)) return false;
    if (checksFromTopLeft(row - 1, col - 1, color2, 0)) return false;
    if (checksFromTopRight(row - 1, col + 1, color2, 0)) return false;
    if (checksFromBottomLeft(row + 1, col - 1, color2, 0)) return false;
    if (checksFromBottomRight(row + 1, col + 1, color2, 0)) return false;
    return true;
}

function findKingsMoveOnCheck(color) {
    const kingSqr = kingSquare[color];
    const kingRank = Number(kingSqr.currentPosition[1]);
    const kingCol = kingSqr.currentPosition.charCodeAt(0) - 97;
    let kingMoves = kingClickHelper(kingRank, kingCol, color);

    kingMoves.high = kingMoves.high.filter((id) => {
        return findKingsMoveOnCheckHelper(id, color);
    });
    kingMoves.capt = kingMoves.capt.filter((id) => {
        return findKingsMoveOnCheckHelper(id, color);
    });
    return kingMoves
}

function findOtherMoveOnCheckHelper(row, col, kingRow, kingCol, high) {
    let r = row - kingRow;
    let c = col - kingCol;
    if (r != 0) r = r < 0 ? 1 : -1;
    if (c != 0) c = c < 0 ? 1 : -1;

    for (row += r, col += c; row != kingRow || col != kingCol; row += r, col += c) {
        high.push(gameState[row][col].id);
    }
}

function findOtherMoveOnCheck(color, row, col) {
    const kingSqr = kingSquare[color];
    const kingRow = 8 - Number(kingSqr.currentPosition[1]);
    const kingCol = kingSqr.currentPosition.charCodeAt(0) - 97;
    const capt = [gameState[row][col].id];
    const high = [];

    if (row == kingRow || col == kingCol || Math.abs(row - kingRow) == Math.abs(col - kingCol))
        findOtherMoveOnCheckHelper(row, col, kingRow, kingCol, high);

    return { high, capt };
}

export {
    topLeft, topRight, bottomLeft, bottomRight, left, right, top, bottom,
    checksFromBottom, checksFromBottomLeft, checksFromBottomRight, checksFromKnight,
    checksFromLeft, checksFromRight, checksFromTop, checksFromTopLeft, checksFromTopRight,
    findKingsMoveOnCheck, findOtherMoveOnCheck, findKingsMoveOnCheckHelper
}
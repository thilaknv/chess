import {
    alpha, opposite
} from "../Data/data.js";
import { endGame } from "../Render/main.js";
import {
    bishopClick, blackPawnClick, kingClickHelper, knightClick, queenClick,
    rookClick, searchInGameState, searchInKingImm, whitePawnClick
} from "./global.js";
import { gameState } from "../app.js";
import { staleMate, piecesList, action, checkDetails, kingSquare } from "../Data/data.js";

function topLeft(highLightSquares, capturableSquares, i, j, type) {
    if (i < 0 || j < 0) return;
    if (gameState[i][j].piece) {
        if (type[0] != gameState[i][j].piece.pieceName[0]) {
            capturableSquares.push(`${alpha[j]}${8 - i}`);
        }
        return;
    }
    highLightSquares.push(`${alpha[j]}${8 - i}`);
    if (staleMate.staleCheck) return;
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
    if (staleMate.staleCheck) return;
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
    if (staleMate.staleCheck) return;
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
    if (staleMate.staleCheck) return;
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
    if (staleMate.staleCheck) return;
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
    if (staleMate.staleCheck) return;
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
    if (staleMate.staleCheck) return;
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
    if (staleMate.staleCheck) return;
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

// kings defenders at all direction

function defenderFromTop(row, col, color) {
    if (row < 0) return null;
    const piece = gameState[row][col].piece;


    if (!piece)
        return defenderFromTop(row - 1, col, color);

    if (color[0] != piece.pieceName[0]) {
        return null;
    }

    return gameState[row][col].id;
}

function defenderFromLeft(row, col, color) {
    if (col < 0) return null;
    const piece = gameState[row][col].piece;


    if (!piece)
        return defenderFromLeft(row, col - 1, color);

    if (color[0] != piece.pieceName[0]) {
        return null;
    }

    return gameState[row][col].id;
}

function defenderFromRight(row, col, color) {
    if (col > 7) return null;
    const piece = gameState[row][col].piece;


    if (!piece)
        return defenderFromRight(row, col + 1, color);

    if (color[0] != piece.pieceName[0]) {
        return null;
    }

    return gameState[row][col].id;
}

function defenderFromBottom(row, col, color) {
    if (row > 7) return null;
    const piece = gameState[row][col].piece;


    if (!piece)
        return defenderFromBottom(row + 1, col, color);

    if (color[0] != piece.pieceName[0]) {
        return null;
    }

    return gameState[row][col].id;
}

function defenderFromTopLeft(row, col, color) {
    if (row < 0 || col < 0) return null;
    const piece = gameState[row][col].piece;


    if (!piece)
        return defenderFromTopLeft(row - 1, col - 1, color, 1);

    if (color[0] != piece.pieceName[0]) {
        return null;
    }

    return gameState[row][col].id;
}

function defenderFromTopRight(row, col, color) {
    if (row < 0 || col > 7) return null;
    const piece = gameState[row][col].piece;


    if (!piece)
        return defenderFromTopRight(row - 1, col + 1, color, 1);

    if (color[0] != piece.pieceName[0]) {
        return null;
    }

    return gameState[row][col].id;
}

function defenderFromBottomLeft(row, col, color) {
    if (row > 7 || col < 0) return null;
    const piece = gameState[row][col].piece;


    if (!piece)
        return defenderFromBottomLeft(row + 1, col - 1, color, 1);

    if (color[0] != piece.pieceName[0]) {
        return null;
    }

    return gameState[row][col].id;
}

function defenderFromBottomRight(row, col, color) {
    if (row > 7 || col > 7) return null;
    const piece = gameState[row][col].piece;


    if (!piece)
        return defenderFromBottomRight(row + 1, col + 1, color, 1);

    if (color[0] != piece.pieceName[0]) {
        return null;
    }

    return gameState[row][col].id;
}

// ------------------


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

function removable(color2) {
    const id = `${alpha[checkDetails.checker.col]}${8 - checkDetails.checker.row}`;
    const direction = searchInKingImm(color2, id);
    const row = 8 - Number(id[1]);
    const col = id.charCodeAt(0) - 97;
    switch (direction) {
        case 'left': if (checksFromLeft(row, col - 1, opposite[color2])) return false;
        case 'right': if (checksFromRight(row, col + 1, opposite[color2])) return false;

        case 'top': if (checksFromTop(row - 1, col, opposite[color2])) return false;
        case 'bottom': if (checksFromBottom(row + 1, col, opposite[color2])) return false;

        case 'topright': if (checksFromTopRight(row - 1, col + 1, opposite[color2])) return false;
        case 'bottomleft': if (checksFromBottomLeft(row + 1, col - 1, opposite[color2])) return false;

        case 'topleft': if (checksFromTopLeft(row - 1, col - 1, opposite[color2])) return false;
        case 'bottomright': if (checksFromBottomRight(row + 1, col + 1, opposite[color2])) return false;
    }
    return true;
}

function pawnCanDefend(row, col, color2, depth) {
    if (row < 0 || row > 7 || depth > 1) return false;

    let sign = 1;
    if (color2 == 'black') {
        sign = -1;
    }

    const piece = gameState[row][col].piece;

    if (!piece) return pawnCanDefend(row + sign, col, color2, depth + 1);

    addCheckDetails(row, col);

    if (piece.pieceName.includes(`${color2}Pawn`)) {
        if (depth == 1) {
            return (color2 == 'black' && row == 1) || (color2 == 'white' && row == 6);
        }
        return true;
    }
    return false;
}

function pawnCanDefendEnpassant(row, col, color2) {
    let piece;
    if (col != 0) {
        piece = gameState[row][col - 1].piece;
        addCheckDetails(row, col - 1);
        if (piece && piece.pieceName == `${color2}Pawn`) return true;
    }
    if (col != 7) {
        piece = gameState[row][col + 1].piece;
        addCheckDetails(row, col + 1);
        if (piece && piece.pieceName == `${color2}Pawn`) return true;
    }
    return false;
}

function isPossibleToDefendCheckHelper(id, color2, depth) {
    const row = 8 - Number(id[1]);
    const col = id.charCodeAt(0) - 97;
    if (checksFromKnight(row, col, color2) && removable(color2)) return true;
    if (checksFromTop(row - 1, col, color2) && removable(color2)) return true;
    if (checksFromLeft(row, col - 1, color2) && removable(color2)) return true;
    if (checksFromRight(row, col + 1, color2) && removable(color2)) return true;
    if (checksFromBottom(row + 1, col, color2) && removable(color2)) return true;
    if (checksFromTopLeft(row - 1, col - 1, color2, depth) && removable(color2)) return true;
    if (checksFromTopRight(row - 1, col + 1, color2, depth) && removable(color2)) return true;
    if (checksFromBottomLeft(row + 1, col - 1, color2, depth) && removable(color2)) return true;
    if (checksFromBottomRight(row + 1, col + 1, color2, depth) && removable(color2)) return true;
    if (pawnCanDefend(row, col, color2, 0) && removable(color2)) return true;
    if (!depth) {
        if (gameState[row][col].piece.pieceName.includes('Pawn')) {
            if (color2 == 'white' && row != 3) return false;
            if (color2 == 'black' && row != 4) return false;
            return pawnCanDefendEnpassant(row, col, color2) && removable(color2);
        }
    }
    return false;
}

function isPossibleToDefendCheck(color2, OtherMoveOnCheck) {
    for (let id of OtherMoveOnCheck.high) {
        if (isPossibleToDefendCheckHelper(id, color2, 1)) return true;
    }
    for (let id of OtherMoveOnCheck.capt) {
        if (isPossibleToDefendCheckHelper(id, color2, 0)) return true;
    }
    return false;
}

function moveableKing(color) {
    const kingsMoveOnCheck = findKingsMoveOnCheck(color);
    return kingsMoveOnCheck.high.length != 0 || kingsMoveOnCheck.capt.length != 0;
}

function moveableQueen(square) {
    queenClick(square);
    return action.highLightSquares.length != 0 || action.capturableSquares.length != 0;
}

function moveableBishop(square) {
    bishopClick(square);
    return action.highLightSquares.length != 0 || action.capturableSquares.length != 0;
}

function moveableKnight(square) {
    knightClick(square);
    return action.highLightSquares.length != 0 || action.capturableSquares.length != 0;
}

function moveableRook(square) {
    rookClick(square);
    return action.highLightSquares.length != 0 || action.capturableSquares.length != 0;
}

function moveablePawn(square, color) {
    if (color[0] == 'b') blackPawnClick(square);
    else whitePawnClick(square);
    return action.highLightSquares.length != 0 || action.capturableSquares.length != 0;
}

function checkMate(color, checkCount) {
    checkDetails.oncheck = true;
    const cRow = checkDetails.checker.row;
    const cCol = checkDetails.checker.col;
    const color2 = opposite[color];
    const kingsMoveOnCheck = findKingsMoveOnCheck(color2);
    checkDetails.moveKing.high = kingsMoveOnCheck.high;
    checkDetails.moveKing.capt = kingsMoveOnCheck.capt;

    if (checkCount > 1) {
        checkDetails.on2Xcheck = true;
        if (kingsMoveOnCheck.capt.length == 0 && kingsMoveOnCheck.high.length == 0) {
            endGame(color);
        }
    }

    else {
        const OtherMoveOnCheck = findOtherMoveOnCheck(color2, cRow, cCol);
        if (!isPossibleToDefendCheck(color2, OtherMoveOnCheck)) {
            if (kingsMoveOnCheck.capt.length == 0 && kingsMoveOnCheck.high.length == 0) {
                endGame(color);
            }
        }
        checkDetails.moveOther.high = OtherMoveOnCheck.high;
        checkDetails.moveOther.capt = OtherMoveOnCheck.capt;
    }
}

function isStaleMate(color) {
    staleMate.staleCheck = true;
    let result = false;
    for (let piece of piecesList[color]) {
        const type = piece.pieceName.slice(5);
        const square = searchInGameState(piece.currentPosition);
        switch (type) {
            case 'King': result = moveableKing(color); break;
            case 'Queen': result = moveableQueen(square); break;
            case 'Rook': result = moveableRook(square); break;
            case 'Bishop': result = moveableBishop(square); break;
            case 'Knight': result = moveableKnight(square); break;
            case 'Pawn': result = moveablePawn(square, color); break;
        }
        if (result) break;
    }
    staleMate.staleCheck = false;
    return !result;
}

export {
    topLeft, topRight, bottomLeft, bottomRight, left, right, top, bottom,
    checksFromBottom, checksFromBottomLeft, checksFromBottomRight, checksFromKnight,
    checksFromLeft, checksFromRight, checksFromTop, checksFromTopLeft, checksFromTopRight,
    findKingsMoveOnCheck, findOtherMoveOnCheck, findKingsMoveOnCheckHelper, defenderFromBottom,
    defenderFromBottomLeft, defenderFromBottomRight, defenderFromLeft, defenderFromRight, defenderFromTop,
    defenderFromTopLeft, defenderFromTopRight, isPossibleToDefendCheck, isStaleMate, checkMate
}
import {
    highLightSqRender, remHighLightSqRender, renderSquares, capturableSqRender,
    RemCapturableSqRender, selectedSqRender, remSelectedSqRender, endGame
} from "../Render/main.js";
import { alpha, canCastle, BOARD, opposite, myData } from "../Data/data.js";
import {
    topLeft, topRight, bottomLeft, bottomRight, left, right, top, bottom,
    checksFromBottom, checksFromBottomLeft, checksFromBottomRight,
    checksFromKnight, checksFromLeft, checksFromRight, checksFromTop,
    checksFromTopLeft, checksFromTopRight, findKingsMoveOnCheck,
    findKingsMoveOnCheckHelper, defenderFromBottom,
    defenderFromBottomLeft, defenderFromBottomRight, defenderFromLeft,
    defenderFromRight, defenderFromTop, defenderFromTopLeft,
    defenderFromTopRight, isStaleMate, checkMate
} from "./traverse.js";

import { BIGDATA, sendMove } from "../Render/socket.js";
// import { BIGDATA } from "../Data/data.js";
// gameState, staleMate, piecesList, enpassantDetails, action, checkDetails, kingSquare, kingImmediateSet, prevKing


function searchInGameState(id) {
    const col = id.charCodeAt(0) - 97;
    const row = 8 - Number(id[1]);
    return BIGDATA.gameState[row][col];
}

function searchInKingImm(color, id) {
    if (BIGDATA.kingImmediateSet[color].topleft == id) return 'topleft';
    if (BIGDATA.kingImmediateSet[color].top == id) return 'top';
    if (BIGDATA.kingImmediateSet[color].topright == id) return 'topright';
    if (BIGDATA.kingImmediateSet[color].left == id) return 'left';
    if (BIGDATA.kingImmediateSet[color].right == id) return 'right';
    if (BIGDATA.kingImmediateSet[color].bottomleft == id) return 'bottomleft';
    if (BIGDATA.kingImmediateSet[color].bottom == id) return 'bottom';
    if (BIGDATA.kingImmediateSet[color].bottomright == id) return 'bottomright';
}

function filterHelperOther(temp) {
    BIGDATA.action.highLightSquares = BIGDATA.action.highLightSquares.filter(id => BIGDATA.checkDetails.moveOther.high.includes(id));
    let tempId = null;
    if (temp && BIGDATA.enpassantDetails.canDoEnpassant) {
        if (BIGDATA.action.capturableSquares.length && BIGDATA.checkDetails.moveOther.capt.length) {
            BIGDATA.action.capturableSquares.forEach(id => {
                if (id[0] == BIGDATA.checkDetails.moveOther.capt[0][0])
                    tempId = id;
            });
        }
    }
    BIGDATA.action.capturableSquares = BIGDATA.action.capturableSquares.filter(id => BIGDATA.checkDetails.moveOther.capt.includes(id));
    if (tempId) BIGDATA.action.capturableSquares.push(tempId);
    return true;
}

function filterKingImmMoveHelper1(char) {
    BIGDATA.action.highLightSquares = BIGDATA.action.highLightSquares.filter(id => id.includes(char));
    BIGDATA.action.capturableSquares = BIGDATA.action.capturableSquares.filter(id => id.includes(char));
}

function filterKingImmMoveHelper2(Row, Col, slope) {
    BIGDATA.action.highLightSquares = BIGDATA.action.highLightSquares.filter(id => {
        const row = 8 - Number(id[1]);
        const col = id.charCodeAt(0) - 97;
        return Row - row == slope * (Col - col);
    });
    BIGDATA.action.capturableSquares = BIGDATA.action.capturableSquares.filter(id => {
        const row = 8 - Number(id[1]);
        const col = id.charCodeAt(0) - 97;
        return Row - row == slope * (Col - col);
    });
}

function filterKingImmMove(direction, id, color) {
    const row = 8 - Number(id[1]);
    const col = id.charCodeAt(0) - 97;
    switch (direction) {
        case 'left': checksFromLeft(row, col - 1, color) && filterKingImmMoveHelper1(id[1]); break;
        case 'right': checksFromRight(row, col + 1, color) && filterKingImmMoveHelper1(id[1]); break;

        case 'top': checksFromTop(row - 1, col, color) && filterKingImmMoveHelper1(id[0]); break;
        case 'bottom': checksFromBottom(row + 1, col, color) && filterKingImmMoveHelper1(id[0]); break;

        case 'topright': checksFromTopRight(row - 1, col + 1, color, 1) && filterKingImmMoveHelper2(BIGDATA.checkDetails.checker.row, BIGDATA.checkDetails.checker.col, -1); break;
        case 'bottomleft': checksFromBottomLeft(row + 1, col - 1, color, 1) && filterKingImmMoveHelper2(BIGDATA.checkDetails.checker.row, BIGDATA.checkDetails.checker.col, -1); break;

        case 'topleft': checksFromTopLeft(row - 1, col - 1, color, 1) && filterKingImmMoveHelper2(BIGDATA.checkDetails.checker.row, BIGDATA.checkDetails.checker.col, 1); break;
        case 'bottomright': checksFromBottomRight(row + 1, col + 1, color, 1) && filterKingImmMoveHelper2(BIGDATA.checkDetails.checker.row, BIGDATA.checkDetails.checker.col, 1); break;
    }
}

function updateKingImmMove(color) {
    const kingSqr = BIGDATA.kingSquare[color];
    const row = 8 - Number(kingSqr.currentPosition[1]);
    const col = kingSqr.currentPosition.charCodeAt(0) - 97;

    BIGDATA.kingImmediateSet[color].top = defenderFromTop(row - 1, col, color);
    BIGDATA.kingImmediateSet[color].left = defenderFromLeft(row, col - 1, color);
    BIGDATA.kingImmediateSet[color].right = defenderFromRight(row, col + 1, color);
    BIGDATA.kingImmediateSet[color].bottom = defenderFromBottom(row + 1, col, color);
    BIGDATA.kingImmediateSet[color].topleft = defenderFromTopLeft(row - 1, col - 1, color);
    BIGDATA.kingImmediateSet[color].topright = defenderFromTopRight(row - 1, col + 1, color);
    BIGDATA.kingImmediateSet[color].bottomleft = defenderFromBottomLeft(row + 1, col - 1, color);
    BIGDATA.kingImmediateSet[color].bottomright = defenderFromBottomRight(row + 1, col + 1, color);

}

function whitePawnClick(square) {
    BIGDATA.staleMate.staleCheck || selectedSqRender(square);
    const piece = square.piece;
    const currentPosition = piece.currentPosition;
    const rank = currentPosition[1];
    const col = currentPosition[0];
    const color = piece.pieceName.includes('black') ? 'black' : 'white';
    let destPiece;
    if (rank == 8) return;

    let destinId = `${col}${Number(rank) + 1}`;
    BIGDATA.action.srcSquare = square;
    if (!searchInGameState(destinId).piece) {
        BIGDATA.action.highLightSquares.push(destinId);
        destinId = `${col}${Number(currentPosition[1]) + 2}`;
        if (rank == 2 && !searchInGameState(destinId).piece) {
            BIGDATA.action.highLightSquares.push(destinId);
        }
    }
    if (col != 'a') {
        destinId = `${alpha[col.charCodeAt(0) - 98]}${Number(rank) + 1}`;
        if ((destPiece = searchInGameState(destinId).piece)) {
            if (destPiece.pieceName[0] != square.piece.pieceName[0]) {
                BIGDATA.action.capturableSquares.push(destinId);
            }
        }
    }
    if (col != 'h') {
        destinId = `${alpha[col.charCodeAt(0) - 96]}${Number(rank) + 1}`;
        if ((destPiece = searchInGameState(destinId).piece)) {
            if (destPiece.pieceName[0] != square.piece.pieceName[0]) {
                BIGDATA.action.capturableSquares.push(destinId);
            }
        }
    }

    if (BIGDATA.enpassantDetails.pawn2Xmoved && color != BIGDATA.enpassantDetails.prevMovePieceColor) {
        const tempId = BIGDATA.enpassantDetails.prevMoveSqId;
        if (rank == tempId[1] && col != 'a' && tempId[0] == alpha[col.charCodeAt(0) - 98]) {
            BIGDATA.enpassantDetails.canDoEnpassant = true;
            BIGDATA.enpassantDetails.goto = `${tempId[0]}${Number(rank) + 1}`
            BIGDATA.action.capturableSquares.push(BIGDATA.enpassantDetails.goto);
        }
        else if (rank == tempId[1] && col != 'h' && tempId[0] == alpha[col.charCodeAt(0) - 96]) {
            BIGDATA.enpassantDetails.canDoEnpassant = true;
            BIGDATA.enpassantDetails.goto = `${tempId[0]}${Number(rank) + 1}`
            BIGDATA.action.capturableSquares.push(BIGDATA.enpassantDetails.goto);
        }
    }

    let direction;
    if ((direction = searchInKingImm(color, square.id))) {
        filterKingImmMove(direction, square.id, opposite[color]);
    }
    BIGDATA.checkDetails.oncheck && filterHelperOther(true);
}

function blackPawnClick(square) {
    BIGDATA.staleMate.staleCheck || selectedSqRender(square);
    const piece = square.piece;
    const color = piece.pieceName.includes('black') ? 'black' : 'white';
    const currentPosition = piece.currentPosition;
    const rank = currentPosition[1];
    const col = currentPosition[0];
    let destPiece;
    if (rank == 1) return;

    let destinId = `${col}${Number(rank) - 1}`;
    BIGDATA.action.srcSquare = square;
    if (!searchInGameState(destinId).piece) {
        BIGDATA.action.highLightSquares.push(destinId);
        destinId = `${col}${Number(currentPosition[1]) - 2}`;
        if (rank == 7 && !searchInGameState(destinId).piece) {
            BIGDATA.action.highLightSquares.push(destinId);
        }
    }
    if (col != 'a') {
        destinId = `${alpha[col.charCodeAt(0) - 98]}${Number(rank) - 1}`;
        if ((destPiece = searchInGameState(destinId).piece)) {
            if (destPiece.pieceName[0] != square.piece.pieceName[0]) {
                BIGDATA.action.capturableSquares.push(destinId);
            }
        }
    }
    if (col != 'h') {
        destinId = `${alpha[col.charCodeAt(0) - 96]}${Number(rank) - 1}`;
        if ((destPiece = searchInGameState(destinId).piece)) {
            if (destPiece.pieceName[0] != square.piece.pieceName[0]) {
                BIGDATA.action.capturableSquares.push(destinId);
            }
        }
    }
    if (BIGDATA.enpassantDetails.pawn2Xmoved && color != BIGDATA.enpassantDetails.prevMovePieceColor) {
        const tempId = BIGDATA.enpassantDetails.prevMoveSqId;
        if (rank == tempId[1] && col != 'a' && tempId[0] == alpha[col.charCodeAt(0) - 98]) {
            BIGDATA.enpassantDetails.canDoEnpassant = true;
            BIGDATA.enpassantDetails.goto = `${tempId[0]}${Number(rank) - 1}`
            BIGDATA.action.capturableSquares.push(BIGDATA.enpassantDetails.goto);
        }
        else if (rank == tempId[1] && col != 'h' && tempId[0] == alpha[col.charCodeAt(0) - 96]) {
            BIGDATA.enpassantDetails.canDoEnpassant = true;
            BIGDATA.enpassantDetails.goto = `${tempId[0]}${Number(rank) - 1}`
            BIGDATA.action.capturableSquares.push(BIGDATA.enpassantDetails.goto);
        }
    }
    let direction;
    if ((direction = searchInKingImm(color, square.id))) {
        filterKingImmMove(direction, square.id, opposite[color]);
    }
    BIGDATA.checkDetails.oncheck && filterHelperOther(true);
}

function knightClick(square) {
    BIGDATA.staleMate.staleCheck || selectedSqRender(square);
    BIGDATA.action.srcSquare = square;
    const piece = square.piece;
    const color = piece.pieceName.includes('black') ? 'black' : 'white';
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
                BIGDATA.action.capturableSquares.push(destId);
            }
        }
        else {
            BIGDATA.action.highLightSquares.push(destId);
        }
    });
    let direction;
    if ((direction = searchInKingImm(color, square.id))) {
        filterKingImmMove(direction, square.id, opposite[color]);
    }
    BIGDATA.checkDetails.oncheck && filterHelperOther();
}

function bishopClick(square) {
    BIGDATA.staleMate.staleCheck || selectedSqRender(square);
    BIGDATA.action.srcSquare = square;
    const piece = square.piece;
    const color = piece.pieceName.includes('black') ? 'black' : 'white';
    const rank = Number(square.id[1]);
    const col = square.id.charCodeAt(0);

    topLeft(BIGDATA.action.highLightSquares, BIGDATA.action.capturableSquares, 7 - rank, col - 98, piece.pieceName[0]);
    topRight(BIGDATA.action.highLightSquares, BIGDATA.action.capturableSquares, 7 - rank, col - 96, piece.pieceName[0]);
    bottomLeft(BIGDATA.action.highLightSquares, BIGDATA.action.capturableSquares, 9 - rank, col - 98, piece.pieceName[0]);
    bottomRight(BIGDATA.action.highLightSquares, BIGDATA.action.capturableSquares, 9 - rank, col - 96, piece.pieceName[0]);
    let direction;
    if ((direction = searchInKingImm(color, square.id))) {
        filterKingImmMove(direction, square.id, opposite[color]);
    }
    BIGDATA.checkDetails.oncheck && filterHelperOther();
}

function rookClick(square) {
    BIGDATA.staleMate.staleCheck || selectedSqRender(square);
    BIGDATA.action.srcSquare = square;
    const piece = square.piece;
    const color = piece.pieceName.includes('black') ? 'black' : 'white';
    const rank = Number(square.id[1]);
    const col = square.id.charCodeAt(0);

    top(BIGDATA.action.highLightSquares, BIGDATA.action.capturableSquares, 7 - rank, col - 97, piece.pieceName[0]);
    bottom(BIGDATA.action.highLightSquares, BIGDATA.action.capturableSquares, 9 - rank, col - 97, piece.pieceName[0]);
    left(BIGDATA.action.highLightSquares, BIGDATA.action.capturableSquares, 8 - rank, col - 98, piece.pieceName[0]);
    right(BIGDATA.action.highLightSquares, BIGDATA.action.capturableSquares, 8 - rank, col - 96, piece.pieceName[0]);
    let direction;
    if ((direction = searchInKingImm(color, square.id))) {
        filterKingImmMove(direction, square.id, opposite[color]);
    }
    BIGDATA.checkDetails.oncheck && filterHelperOther();
}

function queenClick(square) {
    BIGDATA.staleMate.staleCheck || selectedSqRender(square);
    BIGDATA.action.srcSquare = square;
    const piece = square.piece;
    const color = piece.pieceName.includes('black') ? 'black' : 'white';
    const rank = Number(square.id[1]);
    const col = square.id.charCodeAt(0);

    topLeft(BIGDATA.action.highLightSquares, BIGDATA.action.capturableSquares, 7 - rank, col - 98, piece.pieceName[0]);
    topRight(BIGDATA.action.highLightSquares, BIGDATA.action.capturableSquares, 7 - rank, col - 96, piece.pieceName[0]);
    bottomLeft(BIGDATA.action.highLightSquares, BIGDATA.action.capturableSquares, 9 - rank, col - 98, piece.pieceName[0]);
    bottomRight(BIGDATA.action.highLightSquares, BIGDATA.action.capturableSquares, 9 - rank, col - 96, piece.pieceName[0]);
    top(BIGDATA.action.highLightSquares, BIGDATA.action.capturableSquares, 7 - rank, col - 97, piece.pieceName[0]);
    bottom(BIGDATA.action.highLightSquares, BIGDATA.action.capturableSquares, 9 - rank, col - 97, piece.pieceName[0]);
    left(BIGDATA.action.highLightSquares, BIGDATA.action.capturableSquares, 8 - rank, col - 98, piece.pieceName[0]);
    right(BIGDATA.action.highLightSquares, BIGDATA.action.capturableSquares, 8 - rank, col - 96, piece.pieceName[0]);
    let direction;
    if ((direction = searchInKingImm(color, square.id))) {
        filterKingImmMove(direction, square.id, opposite[color]);
    }
    BIGDATA.checkDetails.oncheck && filterHelperOther();
    return true;
}

function kingClickHelper(rank, col, color) {
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

    let tempObj = {
        high: [],
        capt: []
    }
    set.forEach(destId => {
        const destSquare = searchInGameState(destId);
        if (destSquare.piece) {
            if (destSquare.piece.pieceName[0] != color[0]) {
                tempObj.capt.push(destId);
            }
        }
        else {
            tempObj.high.push(destId);
        }
    });
    return tempObj;
}

function kingClick(square, color) {
    selectedSqRender(square);
    BIGDATA.action.srcSquare = square;

    const tempObj = findKingsMoveOnCheck(color);

    BIGDATA.action.highLightSquares = tempObj.high;
    BIGDATA.action.capturableSquares = tempObj.capt;


    if (canCastle[color].status) {
        BIGDATA.checkDetails.oncheck || castlingHelper(color);
    }
}

function castlingHelper(color) {
    const rank = color == "black" ? 8 : 1;
    // shortside rook
    if (!canCastle[color][`rookh${rank}Moved`] && !searchInGameState(`f${rank}`).piece && !searchInGameState(`g${rank}`).piece) {
        if (findKingsMoveOnCheckHelper(`f${rank}`, color) && findKingsMoveOnCheckHelper(`g${rank}`, color)) {
            BIGDATA.action.highLightSquares.push(`h${rank}`);
            BIGDATA.action.highLightSquares.push(`g${rank}`);
            BIGDATA.prevKing.Var1 = true;
        }
    }

    // longside rook
    if (!canCastle[color][`rooka${rank}Moved`] && !searchInGameState(`d${rank}`).piece && !searchInGameState(`c${rank}`).piece && !searchInGameState(`b${rank}`).piece) {
        if (findKingsMoveOnCheckHelper(`c${rank}`, color) && findKingsMoveOnCheckHelper(`d${rank}`, color)) {
            BIGDATA.action.highLightSquares.push(`a${rank}`);
            BIGDATA.action.highLightSquares.push(`c${rank}`);
            BIGDATA.prevKing.Var1 = true;
        }
    }

}

function checkForKing(color) {
    let id = BIGDATA.kingSquare[opposite[color]].currentPosition;
    const row = 8 - Number(id[1]);
    const col = id.charCodeAt(0) - 97;

    let checks = 0;

    checks += checksFromKnight(row, col, color);
    checks += checksFromTop(row - 1, col, color);
    checks += checksFromLeft(row, col - 1, color);
    checks += checksFromRight(row, col + 1, color);
    checks += checksFromBottom(row + 1, col, color);
    checks += checksFromTopLeft(row - 1, col - 1, color, 0);
    checks += checksFromTopRight(row - 1, col + 1, color, 0);
    checks += checksFromBottomLeft(row + 1, col - 1, color, 0);
    checks += checksFromBottomRight(row + 1, col + 1, color, 0);

    return checks;
}

function removeFromPieceList(color, posId) {
    let i = 0;
    for (let piece of BIGDATA.piecesList[color]) {
        if (piece.currentPosition == posId) {
            BIGDATA.piecesList[color].splice(i, 1);
            return;
        } i++;
    }
}

function allHighLightRem() {
    BIGDATA.action.srcSquare && !BIGDATA.action.prevMoveSquares.includes(BIGDATA.action.srcSquare) && remSelectedSqRender(BIGDATA.action.srcSquare);
    BIGDATA.action.destSquare && !BIGDATA.action.prevMoveSquares.includes(BIGDATA.action.destSquare) && remSelectedSqRender(BIGDATA.action.destSquare);

    while (BIGDATA.action.highLightSquares.length > 0) {
        remHighLightSqRender(BIGDATA.action.highLightSquares.pop());
    }

    while (BIGDATA.action.capturableSquares.length > 0) {
        RemCapturableSqRender(BIGDATA.action.capturableSquares.pop());
    }
}

function movementHelper(clickSquareId, movingPiece, color) {

    BIGDATA.action.destSquare = searchInGameState(clickSquareId);
    BIGDATA.action.srcSquare = searchInGameState(BIGDATA.action.srcSquare.id);
    
    movingPiece.currentPosition = clickSquareId;
    if (BIGDATA.action.destSquare.piece) {
        removeFromPieceList(opposite[color], BIGDATA.action.destSquare.piece.currentPosition);
    }
    BIGDATA.action.destSquare.piece = movingPiece;
    BIGDATA.action.srcSquare.piece = null;

    if (BIGDATA.prevKing.Var2) {
        while (BIGDATA.action.prevMoveSquares.length)
            remSelectedSqRender(BIGDATA.action.prevMoveSquares.pop());
    }

    renderSquares(BIGDATA.action.srcSquare, BIGDATA.action.destSquare, true);
    selectedSqRender(BIGDATA.action.destSquare);
    selectedSqRender(BIGDATA.action.srcSquare);

    BIGDATA.action.prevMoveSquares.push(BIGDATA.action.srcSquare);
    BIGDATA.action.prevMoveSquares.push(BIGDATA.action.destSquare);
}

function movementTo(clickSquareId) {

    BIGDATA.prevKing.Var2 = true;
    BIGDATA.enpassantDetails.pawn2Xmoved = false;

    const movingPiece = BIGDATA.action.srcSquare.piece;
    const color = movingPiece.pieceName.includes("black") ? 'black' : 'white';


    if (movingPiece.pieceName.includes('Pawn') && Math.abs(Number(BIGDATA.action.srcSquare.id[1]) - Number(clickSquareId[1])) == 2) {
        BIGDATA.enpassantDetails.pawn2Xmoved = true;
        BIGDATA.enpassantDetails.prevMoveSqId = clickSquareId;
        BIGDATA.enpassantDetails.prevMovePieceColor = color;
    }

    if (BIGDATA.prevKing.Var1) {
        if (clickSquareId[0] == 'h')
            clickSquareId = `g${color == 'black' ? 8 : 1}`;
        if (clickSquareId[0] == 'a')
            clickSquareId = `c${color == 'black' ? 8 : 1}`;
    }

    if (BIGDATA.enpassantDetails.canDoEnpassant) {
        if (clickSquareId != BIGDATA.enpassantDetails.goto) {
            BIGDATA.enpassantDetails.canDoEnpassant = false;
        }
    }
    movementHelper(clickSquareId, movingPiece, color);
    BIGDATA.enpassantDetails.canDoEnpassant = false;

    if (BIGDATA.prevKing.Var1 && clickSquareId[1] != '2' && clickSquareId[0] != 'd' && clickSquareId[0] != 'f') {
        BIGDATA.prevKing.Var2 = false;
        let clickSquareId2 = `${clickSquareId[0] == 'g' ? 'f' : 'd'}${clickSquareId[1]}`;
        let tempId = `${clickSquareId[0] == 'g' ? 'h' : 'a'}${color == 'black' ? 8 : 1}`;
        BIGDATA.action.srcSquare = searchInGameState(tempId);
        const movingPiece2 = BIGDATA.action.srcSquare.piece;
        movementHelper(clickSquareId2, movingPiece2, color);
    }

    if (canCastle[color].status) {
        if (movingPiece.pieceName.includes("King")) {
            canCastle[color].status = false;
        }
        else if (movingPiece.pieceName.includes("Rook")) {
            const colChar = BIGDATA.action.srcSquare.id.charAt(0);
            if (colChar == 'a' || colChar == 'h') {
                const rank = color == 'black' ? 8 : 1;
                canCastle[color][`rook${colChar}${rank}Moved`] = true;
                canCastle[color].status = !canCastle[color][`rooka${rank}Moved`] || !canCastle[color][`rookh${rank}Moved`];
            }
        }
    }

    updateKingImmMove(color);
    updateKingImmMove(opposite[color]);
    allHighLightRem();

    BIGDATA.action.prevColor = color;
    let checkCount;
    BIGDATA.checkDetails.oncheck = false;
    BIGDATA.checkDetails.on2Xcheck = false;

    if ((checkCount = checkForKing(color))) {
        checkMate(color, checkCount);
    } else {
        isStaleMate(opposite[color]) && endGame("Draw");
    }
    BIGDATA.prevKing.Var1 = false;
}



function globalEvent() {
    BOARD.addEventListener("contextmenu", event => {
        event.preventDefault();
    });

    BOARD.addEventListener("click", event => {

        if (!myData.myMove) return;
        if (event.target.id == 'board') return;
        const localName = event.target.localName;
        let clickSquareId = localName == 'div' ? event.target.id : event.target.parentNode.id;

        if (BIGDATA.action.highLightSquares.includes(clickSquareId) || BIGDATA.action.capturableSquares.includes(clickSquareId)) {
            sendMove(clickSquareId)
            movementTo(clickSquareId);
        }

        else if (localName == 'img') {
            const square = searchInGameState(clickSquareId);

            if (square.piece.pieceName.includes('black')) {
                if (myData.color == 'white') return;
            } else {
                if (myData.color == 'black') return;
            }
            allHighLightRem();
            BIGDATA.prevKing.Var1 = false;

            switch (square.piece.pieceName) {
                case 'whitePawn':
                    BIGDATA.checkDetails.on2Xcheck || whitePawnClick(square); break;
                case 'blackPawn':
                    BIGDATA.checkDetails.on2Xcheck || blackPawnClick(square); break;
                case 'whiteKnight':
                case 'blackKnight':
                    BIGDATA.checkDetails.on2Xcheck || knightClick(square); break;
                case 'whiteBishop':
                case 'blackBishop':
                    BIGDATA.checkDetails.on2Xcheck || bishopClick(square); break;
                case 'whiteRook':
                case 'blackRook':
                    BIGDATA.checkDetails.on2Xcheck || rookClick(square); break;
                case 'whiteQueen':
                case 'blackQueen':
                    BIGDATA.checkDetails.on2Xcheck || queenClick(square); break;
                case 'whiteKing':
                    kingClick(square, 'white'); break;
                case 'blackKing':
                    kingClick(square, 'black'); break;
            }

            BIGDATA.action.highLightSquares.forEach(highId => {
                highLightSqRender(highId);
            });

            BIGDATA.action.capturableSquares.forEach(capId => {
                capturableSqRender(capId);
            });
        }
    });
}

export {
    globalEvent, searchInGameState, kingClickHelper, searchInKingImm, removeFromPieceList, queenClick, rookClick, bishopClick, knightClick,
    whitePawnClick, blackPawnClick, movementTo
}
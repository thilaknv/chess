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
import { gameState } from "../app.js";
import {
    staleMate, piecesList, enpassantDetails, action, checkDetails,
    kingSquare, kingImmediateSet, prevKing
} from "../Data/data.js";
import { sendMove } from "../Render/socket.js";

function searchInGameState(id) {
    const col = id.charCodeAt(0) - 97;
    const row = 8 - Number(id[1]);
    return gameState[row][col];
}

function searchInKingImm(color, id) {
    if (kingImmediateSet[color].topleft == id) return 'topleft';
    if (kingImmediateSet[color].top == id) return 'top';
    if (kingImmediateSet[color].topright == id) return 'topright';
    if (kingImmediateSet[color].left == id) return 'left';
    if (kingImmediateSet[color].right == id) return 'right';
    if (kingImmediateSet[color].bottomleft == id) return 'bottomleft';
    if (kingImmediateSet[color].bottom == id) return 'bottom';
    if (kingImmediateSet[color].bottomright == id) return 'bottomright';
}

function filterHelperOther(temp) {
    action.highLightSquares = action.highLightSquares.filter(id => checkDetails.moveOther.high.includes(id));
    let tempId = null;
    if (temp && enpassantDetails.canDoEnpassant) {
        if (action.capturableSquares.length && checkDetails.moveOther.capt.length) {
            action.capturableSquares.forEach(id => {
                if (id[0] == checkDetails.moveOther.capt[0][0])
                    tempId = id;
            });
        }
    }
    action.capturableSquares = action.capturableSquares.filter(id => checkDetails.moveOther.capt.includes(id));
    if (tempId) action.capturableSquares.push(tempId);
    return true;
}

function filterKingImmMoveHelper1(char) {
    action.highLightSquares = action.highLightSquares.filter(id => id.includes(char));
    action.capturableSquares = action.capturableSquares.filter(id => id.includes(char));
}

function filterKingImmMoveHelper2(Row, Col, slope) {
    action.highLightSquares = action.highLightSquares.filter(id => {
        const row = 8 - Number(id[1]);
        const col = id.charCodeAt(0) - 97;
        return Row - row == slope * (Col - col);
    });
    action.capturableSquares = action.capturableSquares.filter(id => {
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

        case 'topright': checksFromTopRight(row - 1, col + 1, color, 1) && filterKingImmMoveHelper2(checkDetails.checker.row, checkDetails.checker.col, -1); break;
        case 'bottomleft': checksFromBottomLeft(row + 1, col - 1, color, 1) && filterKingImmMoveHelper2(checkDetails.checker.row, checkDetails.checker.col, -1); break;

        case 'topleft': checksFromTopLeft(row - 1, col - 1, color, 1) && filterKingImmMoveHelper2(checkDetails.checker.row, checkDetails.checker.col, 1); break;
        case 'bottomright': checksFromBottomRight(row + 1, col + 1, color, 1) && filterKingImmMoveHelper2(checkDetails.checker.row, checkDetails.checker.col, 1); break;
    }
}

function updateKingImmMove(color) {
    const kingSqr = kingSquare[color];
    const row = 8 - Number(kingSqr.currentPosition[1]);
    const col = kingSqr.currentPosition.charCodeAt(0) - 97;

    kingImmediateSet[color].top = defenderFromTop(row - 1, col, color);
    kingImmediateSet[color].left = defenderFromLeft(row, col - 1, color);
    kingImmediateSet[color].right = defenderFromRight(row, col + 1, color);
    kingImmediateSet[color].bottom = defenderFromBottom(row + 1, col, color);
    kingImmediateSet[color].topleft = defenderFromTopLeft(row - 1, col - 1, color);
    kingImmediateSet[color].topright = defenderFromTopRight(row - 1, col + 1, color);
    kingImmediateSet[color].bottomleft = defenderFromBottomLeft(row + 1, col - 1, color);
    kingImmediateSet[color].bottomright = defenderFromBottomRight(row + 1, col + 1, color);

}

function whitePawnClick(square) {
    staleMate.staleCheck || selectedSqRender(square);
    const piece = square.piece;
    const currentPosition = piece.currentPosition;
    const rank = currentPosition[1];
    const col = currentPosition[0];
    const color = piece.pieceName.includes('black') ? 'black' : 'white';
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

    if (enpassantDetails.pawn2Xmoved && color != enpassantDetails.prevMovePieceColor) {
        const tempId = enpassantDetails.prevMoveSqId;
        if (rank == tempId[1] && col != 'a' && tempId[0] == alpha[col.charCodeAt(0) - 98]) {
            enpassantDetails.canDoEnpassant = true;
            enpassantDetails.goto = `${tempId[0]}${Number(rank) + 1}`
            action.capturableSquares.push(enpassantDetails.goto);
        }
        else if (rank == tempId[1] && col != 'h' && tempId[0] == alpha[col.charCodeAt(0) - 96]) {
            enpassantDetails.canDoEnpassant = true;
            enpassantDetails.goto = `${tempId[0]}${Number(rank) + 1}`
            action.capturableSquares.push(enpassantDetails.goto);
        }
    }

    let direction;
    if ((direction = searchInKingImm(color, square.id))) {
        filterKingImmMove(direction, square.id, opposite[color]);
    }
    checkDetails.oncheck && filterHelperOther(true);
}

function blackPawnClick(square) {
    staleMate.staleCheck || selectedSqRender(square);
    const piece = square.piece;
    const color = piece.pieceName.includes('black') ? 'black' : 'white';
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
    if (enpassantDetails.pawn2Xmoved && color != enpassantDetails.prevMovePieceColor) {
        const tempId = enpassantDetails.prevMoveSqId;
        if (rank == tempId[1] && col != 'a' && tempId[0] == alpha[col.charCodeAt(0) - 98]) {
            enpassantDetails.canDoEnpassant = true;
            enpassantDetails.goto = `${tempId[0]}${Number(rank) - 1}`
            action.capturableSquares.push(enpassantDetails.goto);
        }
        else if (rank == tempId[1] && col != 'h' && tempId[0] == alpha[col.charCodeAt(0) - 96]) {
            enpassantDetails.canDoEnpassant = true;
            enpassantDetails.goto = `${tempId[0]}${Number(rank) - 1}`
            action.capturableSquares.push(enpassantDetails.goto);
        }
    }
    let direction;
    if ((direction = searchInKingImm(color, square.id))) {
        filterKingImmMove(direction, square.id, opposite[color]);
    }
    checkDetails.oncheck && filterHelperOther(true);
}

function knightClick(square) {
    staleMate.staleCheck || selectedSqRender(square);
    action.srcSquare = square;
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
                action.capturableSquares.push(destId);
            }
        }
        else {
            action.highLightSquares.push(destId);
        }
    });
    let direction;
    if ((direction = searchInKingImm(color, square.id))) {
        filterKingImmMove(direction, square.id, opposite[color]);
    }
    checkDetails.oncheck && filterHelperOther();
}

function bishopClick(square) {
    staleMate.staleCheck || selectedSqRender(square);
    action.srcSquare = square;
    const piece = square.piece;
    const color = piece.pieceName.includes('black') ? 'black' : 'white';
    const rank = Number(square.id[1]);
    const col = square.id.charCodeAt(0);

    topLeft(action.highLightSquares, action.capturableSquares, 7 - rank, col - 98, piece.pieceName[0]);
    topRight(action.highLightSquares, action.capturableSquares, 7 - rank, col - 96, piece.pieceName[0]);
    bottomLeft(action.highLightSquares, action.capturableSquares, 9 - rank, col - 98, piece.pieceName[0]);
    bottomRight(action.highLightSquares, action.capturableSquares, 9 - rank, col - 96, piece.pieceName[0]);
    let direction;
    if ((direction = searchInKingImm(color, square.id))) {
        filterKingImmMove(direction, square.id, opposite[color]);
    }
    checkDetails.oncheck && filterHelperOther();
}

function rookClick(square) {
    staleMate.staleCheck || selectedSqRender(square);
    action.srcSquare = square;
    const piece = square.piece;
    const color = piece.pieceName.includes('black') ? 'black' : 'white';
    const rank = Number(square.id[1]);
    const col = square.id.charCodeAt(0);

    top(action.highLightSquares, action.capturableSquares, 7 - rank, col - 97, piece.pieceName[0]);
    bottom(action.highLightSquares, action.capturableSquares, 9 - rank, col - 97, piece.pieceName[0]);
    left(action.highLightSquares, action.capturableSquares, 8 - rank, col - 98, piece.pieceName[0]);
    right(action.highLightSquares, action.capturableSquares, 8 - rank, col - 96, piece.pieceName[0]);
    let direction;
    if ((direction = searchInKingImm(color, square.id))) {
        filterKingImmMove(direction, square.id, opposite[color]);
    }
    checkDetails.oncheck && filterHelperOther();
}

function queenClick(square) {
    staleMate.staleCheck || selectedSqRender(square);
    action.srcSquare = square;
    const piece = square.piece;
    const color = piece.pieceName.includes('black') ? 'black' : 'white';
    const rank = Number(square.id[1]);
    const col = square.id.charCodeAt(0);

    topLeft(action.highLightSquares, action.capturableSquares, 7 - rank, col - 98, piece.pieceName[0]);
    topRight(action.highLightSquares, action.capturableSquares, 7 - rank, col - 96, piece.pieceName[0]);
    bottomLeft(action.highLightSquares, action.capturableSquares, 9 - rank, col - 98, piece.pieceName[0]);
    bottomRight(action.highLightSquares, action.capturableSquares, 9 - rank, col - 96, piece.pieceName[0]);
    top(action.highLightSquares, action.capturableSquares, 7 - rank, col - 97, piece.pieceName[0]);
    bottom(action.highLightSquares, action.capturableSquares, 9 - rank, col - 97, piece.pieceName[0]);
    left(action.highLightSquares, action.capturableSquares, 8 - rank, col - 98, piece.pieceName[0]);
    right(action.highLightSquares, action.capturableSquares, 8 - rank, col - 96, piece.pieceName[0]);
    let direction;
    if ((direction = searchInKingImm(color, square.id))) {
        filterKingImmMove(direction, square.id, opposite[color]);
    }
    checkDetails.oncheck && filterHelperOther();
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
    action.srcSquare = square;

    const tempObj = findKingsMoveOnCheck(color);

    action.highLightSquares = tempObj.high;
    action.capturableSquares = tempObj.capt;


    if (canCastle[color].status) {
        checkDetails.oncheck || castlingHelper(color);
    }
}

function castlingHelper(color) {
    const rank = color == "black" ? 8 : 1;
    // shortside rook
    if (!canCastle[color][`rookh${rank}Moved`] && !searchInGameState(`f${rank}`).piece && !searchInGameState(`g${rank}`).piece) {
        if (findKingsMoveOnCheckHelper(`f${rank}`, color) && findKingsMoveOnCheckHelper(`g${rank}`, color)) {
            action.highLightSquares.push(`h${rank}`);
            action.highLightSquares.push(`g${rank}`);
            prevKing.Var1 = true;
        }
    }

    // longside rook
    if (!canCastle[color][`rooka${rank}Moved`] && !searchInGameState(`d${rank}`).piece && !searchInGameState(`c${rank}`).piece && !searchInGameState(`b${rank}`).piece) {
        if (findKingsMoveOnCheckHelper(`c${rank}`, color) && findKingsMoveOnCheckHelper(`d${rank}`, color)) {
            action.highLightSquares.push(`a${rank}`);
            action.highLightSquares.push(`c${rank}`);
            prevKing.Var1 = true;
        }
    }

}

function checkForKing(color) {
    let id = kingSquare[opposite[color]].currentPosition;
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
    for (let piece of piecesList[color]) {
        if (piece.currentPosition == posId) {
            piecesList[color].splice(i, 1);
            return;
        } i++;
    }
}

function allHighLightRem() {
    action.srcSquare && !action.prevMoveSquares.includes(action.srcSquare) && remSelectedSqRender(action.srcSquare);
    action.destSquare && !action.prevMoveSquares.includes(action.destSquare) && remSelectedSqRender(action.destSquare);

    while (action.highLightSquares.length > 0) {
        remHighLightSqRender(action.highLightSquares.pop());
    }

    while (action.capturableSquares.length > 0) {
        RemCapturableSqRender(action.capturableSquares.pop());
    }
}

function movementHelper(clickSquareId, movingPiece, color, castle) {

    action.destSquare = searchInGameState(clickSquareId);

    movingPiece.currentPosition = clickSquareId;
    if (action.destSquare.piece) {
        removeFromPieceList(opposite[color], action.destSquare.piece.currentPosition);
    }
    action.destSquare.piece = movingPiece;
    action.srcSquare.piece = null;

    if (!castle) {
        while (action.prevMoveSquares.length)
            remSelectedSqRender(action.prevMoveSquares.pop());
    }

    renderSquares(action.srcSquare, action.destSquare);
    selectedSqRender(action.destSquare);
    selectedSqRender(action.srcSquare);

    action.prevMoveSquares.push(action.srcSquare);
    action.prevMoveSquares.push(action.destSquare);
}

function movementTo(clickSquareId) {


    const movingPiece = action.srcSquare.piece;
    const color = movingPiece.pieceName.includes("black") ? 'black' : 'white';

    enpassantDetails.pawn2Xmoved = false;
    if (movingPiece.pieceName.includes('Pawn') && Math.abs(Number(action.srcSquare.id[1]) - Number(clickSquareId[1])) == 2) {
        enpassantDetails.pawn2Xmoved = true;
        enpassantDetails.prevMoveSqId = clickSquareId;
        enpassantDetails.prevMovePieceColor = color;
    }

    if (prevKing.Var1) {
        if (clickSquareId[0] == 'h')
            clickSquareId = `g${color == 'black' ? 8 : 1}`;
        if (clickSquareId[0] == 'a')
            clickSquareId = `c${color == 'black' ? 8 : 1}`;
    }

    if (enpassantDetails.canDoEnpassant) {
        if (clickSquareId != enpassantDetails.goto) {
            enpassantDetails.canDoEnpassant = false;
        }
    }
    movementHelper(clickSquareId, movingPiece, color);
    enpassantDetails.canDoEnpassant = false;

    if (prevKing.Var1 && clickSquareId[1] != '2' && clickSquareId[0] != 'd' && clickSquareId[0] != 'f') {
        let clickSquareId2 = `${clickSquareId[0] == 'g' ? 'f' : 'd'}${clickSquareId[1]}`;
        let tempId = `${clickSquareId[0] == 'g' ? 'h' : 'a'}${color == 'black' ? 8 : 1}`;
        action.srcSquare = searchInGameState(tempId);
        const movingPiece2 = action.srcSquare.piece;
        movementHelper(clickSquareId2, movingPiece2, color, true);
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

    updateKingImmMove(color);
    updateKingImmMove(opposite[color]);
    allHighLightRem();

    action.prevColor = color;
    let checkCount;
    checkDetails.oncheck = false;
    checkDetails.on2Xcheck = false;

    if ((checkCount = checkForKing(color))) {
        checkMate(color, checkCount);
    } else {
        isStaleMate(opposite[color]) && endGame("Draw");
    }
    prevKing.Var1 = false;
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

        if (action.highLightSquares.includes(clickSquareId) || action.capturableSquares.includes(clickSquareId)) {
            sendMove(action.srcSquare.id, clickSquareId);
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
            prevKing.Var1 = false;

            switch (square.piece.pieceName) {
                case 'whitePawn':
                    checkDetails.on2Xcheck || whitePawnClick(square); break;
                case 'blackPawn':
                    checkDetails.on2Xcheck || blackPawnClick(square); break;
                case 'whiteKnight':
                case 'blackKnight':
                    checkDetails.on2Xcheck || knightClick(square); break;
                case 'whiteBishop':
                case 'blackBishop':
                    checkDetails.on2Xcheck || bishopClick(square); break;
                case 'whiteRook':
                case 'blackRook':
                    checkDetails.on2Xcheck || rookClick(square); break;
                case 'whiteQueen':
                case 'blackQueen':
                    checkDetails.on2Xcheck || queenClick(square); break;
                case 'whiteKing':
                    kingClick(square, 'white'); break;
                case 'blackKing':
                    kingClick(square, 'black'); break;
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

function manualEvent(fromId, toId) {

    const square = searchInGameState(fromId);
    allHighLightRem();
    prevKing.Var1 = false;
    switch (square.piece.pieceName) {
        case 'whitePawn':
            checkDetails.on2Xcheck || whitePawnClick(square); break;
        case 'blackPawn':
            checkDetails.on2Xcheck || blackPawnClick(square); break;
        case 'whiteKnight':
        case 'blackKnight':
            checkDetails.on2Xcheck || knightClick(square); break;
        case 'whiteBishop':
        case 'blackBishop':
            checkDetails.on2Xcheck || bishopClick(square); break;
        case 'whiteRook':
        case 'blackRook':
            checkDetails.on2Xcheck || rookClick(square); break;
        case 'whiteQueen':
        case 'blackQueen':
            checkDetails.on2Xcheck || queenClick(square); break;
        case 'whiteKing':
            kingClick(square, 'white'); break;
        case 'blackKing':
            kingClick(square, 'black'); break;
    }
    movementTo(toId);
}

export {
    globalEvent, searchInGameState, kingClickHelper, searchInKingImm,
    removeFromPieceList, queenClick, rookClick, bishopClick, knightClick,
    whitePawnClick, blackPawnClick, movementTo, manualEvent
}
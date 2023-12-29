import * as piece from "../Data/pieces.js"
import { BOARD, valueOf, myData } from "../Data/data.js";
import { addAnimation, removeAnimation } from "../Events/animation.js";
import { removeFromPieceList, searchInGameState } from "../Events/global.js";
import { sendMove } from "./socket.js";


import { BIGDATA } from "./socket.js";
// import { BIGDATA } from "../Data/data.js";
// gameState, staleMate, piecesList, enpassantDetails, action, checkDetails, kingSquare, kingImmediateSet, prevKing


function pieceRender(data) {
    data.forEach(row => {
        row.forEach(square => {
            if (square.piece) {
                const squareEl = document.getElementById(square.id);
                const piece = document.createElement("img");
                piece.src = square.piece.src;
                piece.classList.add("piece");
                squareEl.appendChild(piece);
            }
        });
    });
}

function initGameRender(data) {
    data.forEach(row => {
        const rowDiv = document.createElement("div");
        row.forEach(square => {
            let rank = square.id[1];
            let col = square.id[0];
            const newChild = document.createElement("div");
            const highSpan = document.createElement("span");
            highSpan.classList.add("highSpan");
            newChild.setAttribute("id", square.id);
            newChild.className = square.color;
            newChild.appendChild(highSpan);
            rowDiv.appendChild(newChild);

            if (rank == 1) {
                if (col == 'a' || col == 'h')
                    square.piece = piece.whiteRook(square.id);
                else if (col == 'b' || col == 'g')
                    square.piece = piece.whiteKnight(square.id);
                else if (col == 'c' || col == 'f')
                    square.piece = piece.whiteBishop(square.id);
                else if (col == 'd')
                    square.piece = piece.whiteQueen(square.id);
                else
                    square.piece = piece.whiteKing(square.id);
                BIGDATA.piecesList['white'].push(square.piece);
            }
            else if (rank == 8) {
                if (col == 'a' || col == 'h')
                    square.piece = piece.blackRook(square.id);
                else if (col == 'b' || col == 'g')
                    square.piece = piece.blackKnight(square.id);
                else if (col == 'c' || col == 'f')
                    square.piece = piece.blackBishop(square.id);
                else if (col == 'd')
                    square.piece = piece.blackQueen(square.id);
                else
                    square.piece = piece.blackKing(square.id);
                BIGDATA.piecesList['black'].push(square.piece);
            }
            else if (rank == 2) {
                square.piece = piece.whitePawn(square.id);
                BIGDATA.piecesList['white'].push(square.piece);
            } else if (rank == 7) {
                square.piece = piece.blackPawn(square.id);
                BIGDATA.piecesList['black'].push(square.piece);
            }
        });
        rowDiv.classList.add("rowDiv");
        BOARD.appendChild(rowDiv);
    });
    pieceRender(data);
    BIGDATA.kingSquare.black = BIGDATA.gameState[0][4].piece;
    BIGDATA.kingSquare.white = BIGDATA.gameState[7][4].piece;
    sortPieces();
}

function sortPieces() {
    BIGDATA.piecesList['black'].sort((a, b) => {
        a = a.pieceName.substring(5);
        b = b.pieceName.substring(5);
        return valueOf[b] - valueOf[a];
    });
    BIGDATA.piecesList['white'].sort((a, b) => {
        a = a.pieceName.substring(5);
        b = b.pieceName.substring(5);
        return valueOf[b] - valueOf[a];
    });
}

function renderSquares(srcSquare, destSquare) {

    // renderSquares(BIGDATA.action.srcSquare, BIGDATA.action.destSquare, false);
    // myMove && sendMove();

    const pieceEl = document.querySelector(`#${srcSquare.id} img`);
    const unit = BOARD.offsetHeight / 8;
    const destSquareEl = document.getElementById(destSquare.id);
    const childern = destSquareEl.childNodes;
    let pawnProm = false;
    addAnimation(pieceEl, srcSquare.id, destSquare.id, unit);
    if (BIGDATA.enpassantDetails.canDoEnpassant) {
        const tempImg = document.querySelector(`#${BIGDATA.enpassantDetails.prevMoveSqId} img`);
        const row = 8 - Number(BIGDATA.enpassantDetails.prevMoveSqId[1]);
        const col = BIGDATA.enpassantDetails.prevMoveSqId.charCodeAt(0) - 97;
        removeFromPieceList(BIGDATA.gameState[row][col].piece.pieceName.includes('black') ? 'black' : 'white', BIGDATA.enpassantDetails.prevMoveSqId);
        BIGDATA.gameState[row][col].piece = null;
        document.getElementById(BIGDATA.enpassantDetails.prevMoveSqId).removeChild(tempImg);
        // socket data
    }
    if (pieceEl.src.includes("pawn") && (destSquare.id[1] == 1 || destSquare.id[1] == 8)) {
        pawnProm = "queen";
        destSquare.piece.pieceName = destSquare.piece.pieceName.replace("Pawn", pawnProm[0].toUpperCase() + pawnProm.slice(1));
        destSquare.piece.src = destSquare.piece.src.replace("pawn", pawnProm);
        // socket data
    }
    if (childern.length == 2) {
        destSquareEl.removeChild(childern[1]);
        //socket data
    }
    setTimeout(() => {
        removeAnimation(pieceEl);
        if (pawnProm) {
            pieceEl.src = pieceEl.src.replace("pawn", pawnProm);
        }
        destSquareEl.appendChild(pieceEl);
    }, 220);
}

function socketMoveRender() {

    // if (notCastle) {
    //     while (BIGDATA.action.prevMoveSquares.length)
    //         remSelectedSqRender(BIGDATA.action.prevMoveSquares.pop());
    // }
    // if (myData.isPlayer) {
    //     myData.myMove = !myData.myMove;
    // }
    // const fromSqr = searchInGameState(from.id);
    // const toSqr = searchInGameState(to.id);



    // BIGDATA.action.prevMoveSquares.push(fromSqr);
    // BIGDATA.action.prevMoveSquares.push(toSqr);

    // console.log(arguments);
    // BIGDATA.action.prevMoveSquares.forEach(square => {
    //     selectedSqRender(square)
    // });
}

function selectedSqRender({ id, color }) {
    const selSquare = document.querySelector(`#${id}`);
    const classs = `selected${color}`;
    selSquare.classList.contains(classs) || selSquare.classList.add(classs);
}

function remSelectedSqRender({ id, color }) {
    const selSquare = document.querySelector(`#${id}`);
    const classs = `selected${color}`;
    selSquare.classList.contains(classs) && selSquare.classList.remove(classs);
}

function highLightSqRender(sqrId) {
    const highSpan = document.querySelector("#" + sqrId + " span");
    const highSquare = document.getElementById(sqrId);
    highSquare.style.cursor = "pointer";
    highSpan.style.display = "block";
}

function remHighLightSqRender(sqrId) {
    const highSpan = document.querySelector("#" + sqrId + " span");
    const highSquare = document.getElementById(sqrId);
    highSquare.style.cursor = "auto";
    highSpan.style.display = "none";
}

function capturableSqRender(sqrId) {
    const highSpan = document.querySelector("#" + sqrId + " span");
    const tempImg = document.querySelector("#" + sqrId + " img");
    const captSquare = document.getElementById(sqrId);
    captSquare.style.cursor = "pointer";
    highSpan.style.display = "block";
    highSpan.classList.contains("capture") || highSpan.classList.add("capture");
}

function RemCapturableSqRender(sqrId) {
    const highSpan = document.querySelector("#" + sqrId + " span");
    const captSquare = document.getElementById(sqrId);
    captSquare.style.cursor = "auto";
    highSpan.style.display = "none";
    highSpan.classList.contains("capture") && highSpan.classList.remove("capture");
}

function endGame(color) {
    setTimeout(() => {
        BOARD.style.filter = 'blur(1.5px)';
        document.querySelector("#result").style.display = 'flex';
        if (color[0] == 'D')
            document.querySelector("#winner").innerText = color;
        else
            document.querySelector("#winner").innerText = color + " won the game";
        console.log(BIGDATA.gameState);
        console.log(BIGDATA.piecesList);
    }, 500);
}

export {
    initGameRender, highLightSqRender, remHighLightSqRender, renderSquares, capturableSqRender, RemCapturableSqRender,
    selectedSqRender, remSelectedSqRender, endGame, socketMoveRender
}
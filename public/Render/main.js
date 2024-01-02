import * as piece from "../Data/pieces.js"
import { BOARD, valueOf } from "../Data/data.js";
import { addAnimation, removeAnimation } from "../Events/animation.js";
import { removeFromPieceList } from "../Events/global.js";
import { gameState, player_name } from "../app.js";

import {
    piecesList, enpassantDetails, kingSquare
} from "../Data/data.js";
import { endGameState, getname } from "./socket.js";

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

        row.forEach(square => {
            let rank = square.id[1];
            let col = square.id[0];
            const newChild = document.createElement("div");
            const highSpan = document.createElement("span");
            highSpan.classList.add("highSpan");
            newChild.setAttribute("id", square.id);
            newChild.className = square.color;
            newChild.appendChild(highSpan);
            BOARD.appendChild(newChild);

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
                piecesList['white'].push(square.piece);
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
                piecesList['black'].push(square.piece);
            }
            else if (rank == 2) {
                square.piece = piece.whitePawn(square.id);
                piecesList['white'].push(square.piece);
            } else if (rank == 7) {
                square.piece = piece.blackPawn(square.id);
                piecesList['black'].push(square.piece);
            }
        });
    });
    pieceRender(data);
    kingSquare.black = gameState[0][4].piece;
    kingSquare.white = gameState[7][4].piece;
    sortPieces();
}

function sortPieces() {
    piecesList['black'].sort((a, b) => {
        a = a.pieceName.substring(5);
        b = b.pieceName.substring(5);
        return valueOf[b] - valueOf[a];
    });
    piecesList['white'].sort((a, b) => {
        a = a.pieceName.substring(5);
        b = b.pieceName.substring(5);
        return valueOf[b] - valueOf[a];
    });
}

function renderSquares(srcSquare, destSquare) {

    const pieceEl = document.querySelector(`#${srcSquare.id} img`);
    const unit = BOARD.offsetHeight / 8;
    const destSquareEl = document.getElementById(destSquare.id);
    const childern = destSquareEl.childNodes;
    let pawnProm = false;
    addAnimation(pieceEl, srcSquare.id, destSquare.id, unit);
    if (enpassantDetails.canDoEnpassant) {
        const tempImg = document.querySelector(`#${enpassantDetails.prevMoveSqId} img`);
        const row = 8 - Number(enpassantDetails.prevMoveSqId[1]);
        const col = enpassantDetails.prevMoveSqId.charCodeAt(0) - 97;
        removeFromPieceList(gameState[row][col].piece.pieceName.includes('black') ? 'black' : 'white', enpassantDetails.prevMoveSqId);
        gameState[row][col].piece = null;
        document.getElementById(enpassantDetails.prevMoveSqId).removeChild(tempImg);
    }
    if (pieceEl.src.includes("pawn") && (destSquare.id[1] == 1 || destSquare.id[1] == 8)) {
        pawnProm = "queen";
        destSquare.piece.pieceName = destSquare.piece.pieceName.replace("Pawn", pawnProm[0].toUpperCase() + pawnProm.slice(1));
        destSquare.piece.src = destSquare.piece.src.replace("pawn", pawnProm);
    }
    if (childern.length == 2) {
        destSquareEl.removeChild(childern[1]);
    }
    setTimeout(() => {
        removeAnimation(pieceEl);
        if (pawnProm) {
            pieceEl.src = pieceEl.src.replace("pawn", pawnProm);
        }
        destSquareEl.appendChild(pieceEl);
    }, 220);
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
    highSquare.classList.toggle('highSquare', true);
    highSpan.style.display = "block";
}

function remHighLightSqRender(sqrId) {
    const highSpan = document.querySelector("#" + sqrId + " span");
    const highSquare = document.getElementById(sqrId);
    highSquare.classList.toggle('highSquare', false);
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
        if (color[0] == 'D')
            document.querySelector("#winner").innerText = color;
        else {
            const name = getname(color);
            document.querySelector("#winner").innerText = `${name ? name : player_name[color]} Won`;
        }
        document.querySelector("#result").style.display = 'flex';
    }, 100);

    endGameState();
    
    document.querySelector('.resHide').addEventListener('click', () => {
        BOARD.style.filter = 'none';
        document.querySelector("#result").style.display = 'none';
    });
}

export {
    initGameRender, highLightSqRender, remHighLightSqRender, renderSquares, capturableSqRender, RemCapturableSqRender,
    selectedSqRender, remSelectedSqRender, endGame
}
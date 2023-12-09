import * as piece from "../Data/pieces.js"
import { BOARD } from "../Data/constants.js";
import { addAnimation, removeAnimation } from "../Events/animation.js";



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
            }
            else if (rank == 2)
                square.piece = piece.whitePawn(square.id);
            else if (rank == 7)
                square.piece = piece.blackPawn(square.id);
        });
        rowDiv.classList.add("rowDiv");
        BOARD.appendChild(rowDiv);
    });
    pieceRender(data);
}

function renderSquares(srcSquare, destSquare) {
    const piece = document.querySelector(`#${srcSquare.id} img`);
    const unit = BOARD.offsetHeight / 8;
    addAnimation(piece, srcSquare.id, destSquare.id, unit);

    setTimeout(() => {
        removeAnimation(piece);
        const destSquareEl = document.getElementById(destSquare.id);
        const childern = destSquareEl.childNodes;
        if (childern.length == 2)
            destSquareEl.removeChild(childern[1]);
        if (piece.src.includes("pawn") && (destSquare.id[1] == 1 || destSquare.id[1] == 8)) {
            piece.src = piece.src.replace("pawn", "queen");
            destSquare.piece.pieceName = "queen";
            destSquare.piece.src = destSquare.piece.src.replace("pawn", "queen");
        }
        destSquareEl.appendChild(piece);
    }, 100);
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
    const captSquare = document.getElementById(sqrId);
    captSquare.classList.contains("capturable") || captSquare.classList.add("capturable");
}

function RemCapturableSqRender(sqrId) {
    const captSquare = document.getElementById(sqrId);
    captSquare.classList.contains("capturable") && captSquare.classList.remove("capturable");
}


export {
    initGameRender, highLightSqRender, remHighLightSqRender, renderSquares, capturableSqRender, RemCapturableSqRender, selectedSqRender, remSelectedSqRender
}
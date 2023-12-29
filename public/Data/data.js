const BOARD = document.querySelector("#board");

const themeSet = [
    ["#e9edcc", "#779954"]
]
let themeCode = 0;

const valueOf = {
    King: 5,
    Queen: 4,
    Rook: 3,
    Knight: 2,
    Bishop: 1,
    Pawn: 0
}

const myData = {
    color: null,
    isPlayer: false,
    myMove: false
}

const opposite = {
    black: 'white',
    white: 'black'
}

const canCastle = {
    black: {
        status: true,
        rooka8Moved: false,
        rookh8Moved: false,
    },
    white: {
        status: true,
        rooka1Moved: false,
        rookh1Moved: false,
    }
}

const alpha = ["a", "b", "c", "d", "e", "f", "g", "h"];


function Square(color, id) {
    return { color, id, piece: null };
}

function SquareRow(rowId) {
    const squareRow = [];
    const alpha = ["a", "b", "c", "d", "e", "f", "g", "h"];
    alpha.forEach((char, index) => {
        if ((rowId + index) % 2 == 0)
            squareRow.push(Square("white", `${char}${rowId}`));
        else
            squareRow.push(Square("black", `${char}${rowId}`));
    });
    return squareRow;
}

function initGame() {
    return [SquareRow(8), SquareRow(7), SquareRow(6), SquareRow(5), SquareRow(4), SquareRow(3), SquareRow(2), SquareRow(1)];
}

// gameState, staleMate, piecesList, enpassantDetails, action, checkDetails, kingSquare, kingImmediateSet, prevKing



export {
    alpha, canCastle, BOARD, opposite, myData, valueOf
}

export {
    Square, SquareRow, initGame
}
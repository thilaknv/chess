const BOARD = document.querySelector("#board");
const theme = {
    active: 0,
    themeSet: [
        ["#e9edcc", "#779954"],
        ["white", "black"]
    ]
}

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


const staleMate = { staleCheck: false }

const piecesList = { black: [], white: [] }

const enpassantDetails = {
    pawn2Xmoved: false,
    prevMoveSqId: null,
    prevMovePieceColor: null,
    canDoEnpassant: null,
    goto: null
}

const action = {
    highLightSquares: [],
    capturableSquares: [],
    srcSquare: null, //done
    destSquare: null, //done
    prevMoveSquares: [],
    prevColor: 'black'
}

const checkDetails = {
    oncheck: false,
    on2Xcheck: false,
    checker: { row: null, col: null },
    moveKing: { high: [], capt: [] },
    moveOther: { high: [], capt: [] }
}

const kingSquare = { black: null, white: null }

const kingImmediateSet = {
    black: { topleft: null, top: null, topright: null, left: 'd8', right: 'f8', bottomleft: 'd7', bottom: 'e7', bottomright: 'f7' },
    white: { topleft: 'd2', top: 'e2', topright: 'f2', left: 'd1', right: 'f1', bottomleft: null, bottom: null, bottomright: null }
}

const prevKing = { Var1: false, Var2: true };

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
    alpha, canCastle, BOARD, opposite, myData, valueOf,
    staleMate, piecesList, enpassantDetails,
    action, checkDetails, kingSquare, kingImmediateSet, prevKing
}

export {
    Square, SquareRow, initGame
}
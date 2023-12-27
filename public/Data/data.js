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


function Square(color, id, piece) {
    return { color, id, piece };
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

const BIGDATA = {
    gameState: null,
    staleMate: { staleCheck: false },
    piecesList: { black: [], white: [] },
    enpassantDetails: {
        pawn2Xmoved: false,
        prevMoveSqId: null,
        prevMovePieceColor: null,
        canDoEnpassant: null,
        goto: null
    },
    action: {
        highLightSquares: [],
        capturableSquares: [],
        srcSquare: null,
        destSquare: null,
        prevMoveSquares: [],
        prevColor: 'black'
    },
    checkDetails: {
        oncheck: false,
        on2Xcheck: false,
        checker: { row: null, col: null },
        moveKing: { high: [], capt: [] },
        moveOther: { high: [], capt: [] }
    },
    kingSquare: { black: null, white: null },
    kingImmediateSet: {
        black: { topleft: null, top: null, topright: null, left: 'd8', right: 'f8', bottomleft: 'd7', bottom: 'e7', bottomright: 'f7' },
        white: { topleft: 'd2', top: 'e2', topright: 'f2', left: 'd1', right: 'f1', bottomleft: null, bottom: null, bottomright: null }
    },
    prevKing: { Var1: false, Var2: true }
}
const gameState = null;
// globle
const staleMate = {
    staleCheck: false
}

const piecesList = {
    black: [],
    white: []
}

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
    srcSquare: null,
    destSquare: null,
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

const prevKing = {
    Var1: false,
    Var2: true
}

export {
    alpha, canCastle, BOARD, kingSquare, checkDetails, opposite, kingImmediateSet, action,
    enpassantDetails, myData, piecesList, valueOf, staleMate, prevKing
}

export {
    BIGDATA, gameState
}

export {
    Square, SquareRow, initGame
}
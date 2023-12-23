const BOARD = document.querySelector("#board");
const themeSet = [
    ["#e9edcc", "#779954"]
]
let themeCode = 0;

const staleMate = {
    // important
    staleCheck: false
}

const valueOf = {
    King: 5,
    Queen: 4,
    Rook: 3,
    Knight: 2,
    Bishop: 1,
    Pawn: 0
}

const piecesList = {
    black: [],
    white: []
}

const myData = {
    color: null
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
};

const opposite = {
    black: 'white',
    white: 'black'
};

const checkDetails = {
    oncheck: false,
    on2Xcheck: false,
    checker: {
        row: null,
        col: null
    },
    moveKing: {
        high: [],
        capt: []
    },
    moveOther: {
        high: [],
        capt: []
    }
}

const kingSquare = {
    black: null,
    white: null
};

const kingImmediateSet = {
    black: {
        topleft: null,
        top: null,
        topright: null,
        left: 'd8',
        right: 'f8',
        bottomleft: 'd7',
        bottom: 'e7',
        bottomright: 'f7'
    },
    white: {
        topleft: 'd2',
        top: 'e2',
        topright: 'f2',
        left: 'd1',
        right: 'f1',
        bottomleft: null,
        bottom: null,
        bottomright: null
    }
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
};

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

export {
    alpha, canCastle, BOARD, kingSquare, checkDetails, opposite, kingImmediateSet, action,
    enpassantDetails, myData, piecesList, valueOf, staleMate
}

export {
    Square, SquareRow, initGame
}
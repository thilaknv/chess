const BOARD = document.querySelector("#board");
const themeSet = [
    ["#e9edcc", "#779954"]
]
let themeCode = 0;

const kingSquare = {
    black: null,
    white: null
};

const blackKingImmediateSet = {
    topleft: null,
    top: null,
    topright: null,
    left: null,
    right: null,
    bottomleft: null,
    bottom: null,
    bottomright: null
};

const whiteKingImmediateSet = {
    topleft: null,
    top: null,
    topright: null,
    left: null,
    right: null,
    bottomleft: null,
    bottom: null,
    bottomright: null
};

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
const territory = {
    black: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ],
    white: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ]
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
    Square, SquareRow, initGame, alpha, canCastle, BOARD, kingSquare
}